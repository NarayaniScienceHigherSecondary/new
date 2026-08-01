import os
import time
import smtplib
import pymongo
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Hardcoded credentials (since .env doesn't exist here)
MONGO_URI = "mongodb+srv://mishraranubala_db_user:VAyFxc8ASPbSljYT@cluster0.pwe9nug.mongodb.net/?appName=Cluster0"
try:
    client = pymongo.MongoClient(MONGO_URI)
    db = client['college_management']
    print("✅ Successfully connected to Database.")
except Exception as e:
    print(f"❌ Failed to connect to Database: {e}")
    exit(1)

GMAIL_USER = "highersecondaryschoolnarayanis@gmail.com"
GMAIL_APP_PASSWORD = "fciwtkntkzaaeini"

def send_email_smtp(recipient, subject, html_body):
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = f"Narayani Science College <{GMAIL_USER}>"
    msg['To'] = recipient
    
    part = MIMEText(html_body, 'html')
    msg.attach(part)
    
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465)
    server.login(GMAIL_USER, GMAIL_APP_PASSWORD)
    server.sendmail(GMAIL_USER, recipient, msg.as_string())
    server.quit()

print("🚀 Auto-Sender is running... Waiting for emails to send. (Press Ctrl+C to stop)")

while True:
    try:
        pending_emails = list(db['emailHistory'].find({'status': 'pending'}))
        
        if pending_emails:
            print(f"\n📬 Found {len(pending_emails)} new email(s) in queue!")
            
        for email_doc in pending_emails:
            email_id = email_doc.get('id')
            recipient = email_doc.get('recipient')
            try:
                html_body = email_doc.get('message', '')
                send_email_smtp(recipient, email_doc.get('subject'), html_body)
                
                db['emailHistory'].update_one(
                    {'id': email_id},
                    {'$set': {'status': 'sent', 'delivery_timestamp': time.time()}}
                )
                print(f"   ✅ Successfully sent email to {recipient}")
            except Exception as e:
                retry_count = email_doc.get('retry_count', 0) + 1
                status = 'failed' if retry_count >= 3 else 'pending'
                db['emailHistory'].update_one(
                    {'id': email_id},
                    {'$set': {'status': status, 'retry_count': retry_count, 'error_log': str(e)}}
                )
                print(f"   ❌ Failed to send to {recipient}: {e}")
                
    except Exception as e:
        print(f"Database error: {e}")
        
    time.sleep(5)
