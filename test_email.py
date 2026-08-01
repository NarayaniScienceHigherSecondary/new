import smtplib
import os
from dotenv import load_dotenv

load_dotenv()
try:
    server = smtplib.SMTP_SSL('smtp.gmail.com', 465, timeout=5)
    print("Connected to 465 SSL")
    server.login(os.environ.get('GMAIL_USER'), os.environ.get('GMAIL_APP_PASSWORD'))
    print("Logged in!")
    server.quit()
except Exception as e:
    print(f"Error: {e}")
