import sys

def patch_app_py():
    with open('backend/app.py', 'r') as f:
        content = f.read()

    # 1. Imports
    imports_to_add = """
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
import datetime
"""
    content = content.replace("from pymongo import MongoClient", "from pymongo import MongoClient" + imports_to_add)

    # 2. MONGO_URI Env var & Migration
    migration_block = """
MONGO_URI = os.environ.get('MONGO_URI', "mongodb+srv://mishraranubala_db_user:VAyFxc8ASPbSljYT@cluster0.pwe9nug.mongodb.net/?appName=Cluster0")
try:
    client = MongoClient(MONGO_URI)
    db = client['college_management']
    fs = gridfs.GridFS(db)
    print("Connected to MongoDB successfully!")
    
    # Password Migration
    users = list(db['users'].find())
    for u in users:
        if 'password' in u and not u['password'].startswith('scrypt:') and not u['password'].startswith('pbkdf2:'):
            hashed = generate_password_hash(u['password'])
            db['users'].update_one({'_id': u['_id']}, {'$set': {'password': hashed}})
            print(f"Migrated password for user {u.get('id')}")
            
except Exception as e:
"""
    content = content.replace("""MONGO_URI = "mongodb+srv://mishraranubala_db_user:VAyFxc8ASPbSljYT@cluster0.pwe9nug.mongodb.net/?appName=Cluster0"
try:
    client = MongoClient(MONGO_URI)
    db = client['college_management']
    fs = gridfs.GridFS(db)
    print("Connected to MongoDB successfully!")
except Exception as e:""", migration_block)

    # 3. HTTP Login Route
    login_route = """
@app.route('/api/login', methods=['POST'])
def api_login():
    if not db:
        return jsonify({'success': False, 'error': 'Database disconnected'}), 500
    
    data = request.json
    role = data.get('role')
    user_id = data.get('id')
    password = data.get('password')
    
    user = db['users'].find_one({'id': user_id, 'role': role})
    
    if user and 'password' in user and check_password_hash(user['password'], password):
        # Create JWT token
        token = jwt.encode({
            'id': user_id,
            'role': role,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm='HS256')
        
        # Remove password before returning
        user.pop('password', None)
        user.pop('_id', None)
        
        return jsonify({'success': True, 'token': token, 'user': user})
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401
"""
    content = content.replace("# Serve the static frontend", login_route + "\n# Serve the static frontend")

    # 4. Strip passwords in get_full_state
    get_full_state_replacement = """
            # Fetch all documents, omit MongoDB's internal _id field
            cursor = db[key].find({}, {'_id': 0})
            items = list(cursor)
            
            # Remove passwords from users collection before sending
            if key == 'users':
                for item in items:
                    item.pop('password', None)
                    
            state[key] = items
"""
    content = content.replace("""            # Fetch all documents, omit MongoDB's internal _id field
            cursor = db[key].find({}, {'_id': 0})
            state[key] = list(cursor)""", get_full_state_replacement.strip())

    # 5. Prevent update_state from modifying users
    update_state_replacement = """
    if key and data is not None:
        try:
            if key == 'users':
                print("WARNING: Client attempted to update 'users' via generic update_state. Blocked.")
                return
                
            if key in ARRAY_KEYS:
"""
    content = content.replace("""
    if key and data is not None:
        try:
            if key in ARRAY_KEYS:
""", update_state_replacement)

    # 6. Secure User Management Socket Events
    secure_sockets = """
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
        user['password'] = generate_password_hash(user['password'])
        db['users'].insert_one(user)
        users = list(db['users'].find({}, {'_id': 0}))
        for u in users: u.pop('password', None)
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
        for u in users: u.pop('password', None)
        emit('state_updated', {'key': 'users', 'data': users}, broadcast=True)

@socketio.on('admin_delete_user')
def handle_admin_delete_user(payload):
    if not verify_admin_token(payload): return
    user_id = payload.get('id')
    if user_id:
        db['users'].delete_one({'id': user_id})
        users = list(db['users'].find({}, {'_id': 0}))
        for u in users: u.pop('password', None)
        emit('state_updated', {'key': 'users', 'data': users}, broadcast=True)
        emit('force_logout_user', user_id, broadcast=True)

@socketio.on('admin_change_password')
def handle_admin_change_password(payload):
    if not verify_admin_token(payload): return
    user_id = payload.get('id')
    new_password = payload.get('password')
    if user_id and new_password:
        hashed = generate_password_hash(new_password)
        db['users'].update_one({'id': user_id}, {'$set': {'password': hashed}})
        emit('force_logout_user', user_id, broadcast=True, include_self=False)

if __name__ == '__main__':
"""
    content = content.replace("if __name__ == '__main__':", secure_sockets)

    with open('backend/app.py', 'w') as f:
        f.write(content)

patch_app_py()
print("app.py patched successfully")
