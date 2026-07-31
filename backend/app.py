import eventlet
eventlet.monkey_patch()

import os
import io
import time
import gridfs
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from flask import Flask, send_from_directory, request, jsonify, send_file, Response
from flask_socketio import SocketIO, emit
from pymongo import MongoClient
import jwt
import datetime

from dotenv import load_dotenv

load_dotenv()

# Configure application
app = Flask(__name__, static_folder='../')
app.config['SECRET_KEY'] = 'college_secret_key'

# Initialize SocketIO with gevent for production deployment on Render
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='eventlet')

# Configure MongoDB

MONGO_URI = os.environ.get('MONGO_URI', "mongodb+srv://mishraranubala_db_user:VAyFxc8ASPbSljYT@cluster0.pwe9nug.mongodb.net/?appName=Cluster0")
try:
    client = MongoClient(MONGO_URI)
    db = client['college_management']
    fs = gridfs.GridFS(db)
    print("Connected to MongoDB successfully!")
    
    # Password Migration (Revert Bcrypt)
    users = list(db['users'].find())
    for u in users:
        if 'password' in u and (str(u['password']).startswith('scrypt:') or str(u['password']).startswith('pbkdf2:')):
            plain_pass = str(u.get('id', '1234'))
            db['users'].update_one({'_id': u['_id']}, {'$set': {'password': plain_pass}})
            print(f"Reverted encrypted password for user {u.get('id')} to plain text")
            
except Exception as e:

    print(f"CRITICAL: Failed to connect to MongoDB! Error: {e}")
    db = None
    fs = None

# ---- GridFS REST API Endpoints ----
@app.route('/api/upload', methods=['POST'])
def upload_image():
    if not fs:
        return jsonify({'error': 'Database disconnected'}), 500
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    # Delete old file if provided
    old_file_id = request.form.get('old_file_id')
    if old_file_id and old_file_id != 'null':
        try:
            fs.delete(ObjectId(old_file_id))
            print(f"Deleted old GridFS file: {old_file_id}")
        except Exception as e:
            print(f"Failed to delete old file {old_file_id}: {e}")
            
    # Save new file
    filename = secure_filename(file.filename)
    content_type = file.content_type
    
    file_id = fs.put(file, filename=filename, content_type=content_type)
    
    return jsonify({
        'success': True,
        'file_id': str(file_id),
        'url': f'/api/image/{str(file_id)}'
    })

@app.route('/api/image/<file_id>', methods=['GET'])
def get_image(file_id):
    if not fs:
        return "Database disconnected", 500
        
    try:
        grid_out = fs.get(ObjectId(file_id))
        return send_file(
            io.BytesIO(grid_out.read()),
            mimetype=grid_out.content_type,
            download_name=grid_out.filename
        )
    except Exception as e:
        return f"Image not found: {e}", 404

@app.route('/api/image/<file_id>', methods=['DELETE'])
def delete_image(file_id):
    if not fs:
        return jsonify({'error': 'Database disconnected'}), 500
        
    try:
        fs.delete(ObjectId(file_id))
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
# -----------------------------------

# Define keys that are arrays vs objects
ARRAY_KEYS = [
    'users', 'students', 'staff', 'notices', 'holidays', 
    'attendance', 'exams', 'classTests', 'dcrSettings', 
    'dcrRecords', 'cashBookTransactions', 'scholarships', 'gallery',
    'emailTemplates', 'emailHistory'
]
OBJECT_KEYS = ['collegeInfo', 'cashBookSettings', 'emailAnalytics', 'pendingResets']

# ---- EMAIL NOTIFICATION SYSTEM ----
GMAIL_USER = os.environ.get('GMAIL_USER')
GMAIL_APP_PASSWORD = os.environ.get('GMAIL_APP_PASSWORD')

def send_email_smtp(recipient, subject, html_body):
    if not GMAIL_USER or not GMAIL_APP_PASSWORD:
        raise Exception("GMAIL_USER or GMAIL_APP_PASSWORD is not set in environment.")
        
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"Narayani Science College <{GMAIL_USER}>"
    msg['To'] = recipient
    
    part = MIMEText(html_body, 'html')
    msg.attach(part)
    
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
    server.sendmail(GMAIL_USER, recipient, msg.as_string())
    server.quit()

def email_queue_processor():
    """Background thread to process pending emails."""
    print("Email queue processor started.")
    while True:
        try:
            if db is not None:
                # Find pending emails
                pending_emails = list(db['emailHistory'].find({'status': 'pending'}).limit(10))
                for email_doc in pending_emails:
                    email_id = email_doc.get('id')
                    try:
                        # Append tracking pixel to body
                        host_url = os.environ.get('HOST_URL', 'http://localhost:8080')
                        tracking_url = f"{host_url.rstrip('/')}/api/email/track/{email_id}"
                        html_body = email_doc.get('message', '')
                        html_body += f'<img src="{tracking_url}" width="1" height="1" style="display:none;" />'
                        
                        send_email_smtp(email_doc.get('recipient'), email_doc.get('subject'), html_body)
                        
                        db['emailHistory'].update_one(
                            {'id': email_id},
                            {'$set': {'status': 'sent', 'delivery_timestamp': time.time()}}
                        )
                    except Exception as e:
                        retry_count = email_doc.get('retry_count', 0) + 1
                        status = 'failed' if retry_count >= 3 else 'pending'
                        db['emailHistory'].update_one(
                            {'id': email_id},
                            {'$set': {'status': status, 'retry_count': retry_count, 'error_log': str(e)}}
                        )
                    eventlet.sleep(1) # Rate limit: 1 email per second to avoid spam triggers
        except Exception as e:
            print(f"Error in email processor: {e}")
        eventlet.sleep(5) # Poll every 5 seconds

# Start background thread
eventlet.spawn(email_queue_processor)

@socketio.on('enqueue_emails')
def handle_enqueue_emails(payload):
    """
    Payload should be a list of email dicts:
    [{'id': '...', 'recipient': '...', 'subject': '...', 'message': '...', 'status': 'pending', 'timestamp': ...}]
    """
    if db is not None:
        try:
            if isinstance(payload, list) and len(payload) > 0:
                db['emailHistory'].insert_many(payload)
                # Remove ObjectId before emitting
                for item in payload:
                    if '_id' in item:
                        del item['_id']
                # Broadcast new emails to clients so their UI updates
                emit('emails_enqueued', payload, broadcast=True)
        except Exception as e:
            print(f"Error enqueueing emails: {e}")

@app.route('/api/email/track/<msg_id>', methods=['GET'])
def track_email_open(msg_id):
    if db is not None:
        db['emailHistory'].update_one(
            {'id': msg_id, 'status': 'sent'},
            {'$set': {'status': 'opened', 'opened_timestamp': time.time()}}
        )
    # Return 1x1 transparent GIF
    pixel = b'GIF89a\x01\x00\x01\x00\x80\x00\x00\x00\x00\x00\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
    return Response(pixel, mimetype='image/gif')
# -----------------------------------


@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        if db is None:
            return jsonify({'success': False, 'error': 'Database disconnected'}), 500
        
        data = request.json
        user_id = str(data.get('id', '')).strip()
        password = str(data.get('password', '')).strip()
        
        # Use case-insensitive search for user ID
        import re
        # Force hardcoded admin credentials, bypassing DB entirely
        if str(user_id).lower() == 'admin':
            if password == 'Jagannath#1234!':
                user = {'id': 'admin', 'role': 'admin', 'name': 'System Administrator'}
                token = jwt.encode({
                    'id': user.get('id'),
                    'role': user.get('role'),
                    'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
                }, app.config['SECRET_KEY'], algorithm='HS256')
                return jsonify({'success': True, 'token': token, 'user': user})
            else:
                return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
                
        users = list(db['users'].find({'id': re.compile(f'^{user_id}$', re.IGNORECASE)}))
        
        valid_user = None
        for u in users:
            if 'password' in u and str(u['password']).strip() == password:
                valid_user = u
                break
        
        if valid_user:
            # Create JWT token
            token = jwt.encode({
                'id': valid_user.get('id'),
                'role': valid_user.get('role'),
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
            }, app.config['SECRET_KEY'], algorithm='HS256')
            
            # Remove password before returning
            valid_user.pop('password', None)
            valid_user.pop('_id', None)
            
            return jsonify({'success': True, 'token': token, 'user': valid_user})
        else:
            return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
    except Exception as e:
        print(f"Login error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'success': False, 'error': f'Server Error: {str(e)}'}), 500

# Serve the static frontend
@app.route('/')
def serve_index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('../', path)

@socketio.on('connect')
def handle_connect():
    print('Client connected')

@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

@socketio.on('get_full_state')
def handle_get_full_state():
    """
    Sends the entire database state to the newly connected client.
    """
    print("Received get_full_state request...")
    try:
        state = {}
        
        for key in ARRAY_KEYS:
# Fetch all documents, omit MongoDB's internal _id field
            cursor = db[key].find({}, {'_id': 0})
            items = list(cursor)
            
            state[key] = items
            
        for key in OBJECT_KEYS:
            doc = db[key].find_one({}, {'_id': 0})
            state[key] = doc if doc else None
            
        print("Sending full_state_response with keys:", state.keys())
        emit('full_state_response', state)
    except Exception as e:
        print(f"CRITICAL ERROR IN get_full_state: {e}")

@socketio.on('update_state')
def handle_update_state(payload):
    """
    Generic handler to update a specific key in the state.
    Payload should be: {'key': 'students', 'data': [...]}
    """
    key = payload.get('key')
    data = payload.get('data')
    
    if key and data is not None:
        try:
            if key == 'users':
                # Require admin token for any modifications to users!
                token = payload.get('token')
                if not token: 
                    print("Blocked unauthorized users update (No Token)")
                    return
                try:
                    token_data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
                    if token_data.get('role') != 'admin':
                        print("Blocked unauthorized users update (Not Admin)")
                        return
                except:
                    print("Blocked unauthorized users update (Invalid Token)")
                    return
                
                # Fetch existing users to merge passwords securely
                current_users = list(db['users'].find({}))
                db_users_map = {str(u.get('id')): u for u in current_users}
                
                for item in data:
                    item_id = str(item.get('id'))
                    # Missing password in payload, preserve from DB
                    if item_id in db_users_map and 'password' in db_users_map[item_id] and ('password' not in item or not item['password']):
                        item['password'] = db_users_map[item_id]['password']
                for item in data: item.pop('_id', None)
                db['users'].delete_many({})
                if len(data) > 0:
                    db['users'].insert_many(data)
                    
                # Broadcast updated users (with passwords)
                users_clean = list(db['users'].find({}, {'_id': 0}))
                emit('state_updated', {'key': 'users', 'data': users_clean}, broadcast=True, include_self=False)
                return
                
            if key in ARRAY_KEYS:
                # Remove _id if it exists to avoid MongoDB Immutable _id errors
                for item in data:
                    item.pop('_id', None)
                
                # Replace entire collection
                db[key].delete_many({})
                if len(data) > 0:
                    db[key].insert_many(data)
            
            elif key in OBJECT_KEYS:
                if isinstance(data, dict):
                    data.pop('_id', None)
                    db[key].delete_many({})
                    db[key].insert_one(data)
            
            # Remove any injected _id objects before broadcasting
            if isinstance(data, list):
                for item in data:
                    item.pop('_id', None)
            elif isinstance(data, dict):
                data.pop('_id', None)
                    
            # Broadcast the change to all OTHER clients so they can update their local state
            emit('state_updated', {'key': key, 'data': data}, broadcast=True, include_self=False)
            
        except Exception as e:
            print(f"Error updating state for {key}: {e}")


def verify_admin_token(payload):
    token = payload.get('token')
    if not token: return False
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return data.get('role') == 'admin'
    except:
        return False

@socketio.on('admin_add_user')
def handle_admin_add_user(payload):
    if not verify_admin_token(payload): return
    user = payload.get('user')
    if user and 'password' in user:
        pass
        db['users'].insert_one(user)
        users = list(db['users'].find({}, {'_id': 0}))
        emit('state_updated', {'key': 'users', 'data': users}, broadcast=True)

@socketio.on('admin_update_user')
def handle_admin_update_user(payload):
    if not verify_admin_token(payload): return
    user = payload.get('user')
    user_id = user.get('id')
    if user and user_id:
        update_data = {k: v for k, v in user.items() if k != 'password' and k != '_id'}
        db['users'].update_one({'id': user_id}, {'$set': update_data})
        users = list(db['users'].find({}, {'_id': 0}))
        emit('state_updated', {'key': 'users', 'data': users}, broadcast=True)

@socketio.on('admin_delete_user')
def handle_admin_delete_user(payload):
    if not verify_admin_token(payload): return
    user_id = payload.get('id')
    if user_id:
        db['users'].delete_one({'id': user_id})
        users = list(db['users'].find({}, {'_id': 0}))
        emit('state_updated', {'key': 'users', 'data': users}, broadcast=True)
        emit('force_logout_user', user_id, broadcast=True)

@socketio.on('admin_change_password')
def handle_admin_change_password(payload):
    if not verify_admin_token(payload): return
    user_id = payload.get('id')
    new_password = payload.get('password')
    if user_id and new_password:
        hashed = new_password
        db['users'].update_one({'id': user_id}, {'$set': {'password': hashed}})
        emit('force_logout_user', user_id, broadcast=True, include_self=False)

if __name__ == '__main__':

    port = int(os.environ.get('PORT', 8080))
    print(f"Starting Flask-SocketIO Server on port {port}...")
    socketio.run(app, host='0.0.0.0', port=port, allow_unsafe_werkzeug=True)
