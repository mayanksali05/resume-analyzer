import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/campus_placement")
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    # Use /tmp for uploads in serverless environments (like Vercel)
    UPLOAD_FOLDER = '/tmp/uploads' if os.environ.get('VERCEL') else os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf'}
    
    # Mail Configuration
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')
    MAIL_DEFAULT_SENDER = os.getenv('MAIL_DEFAULT_SENDER', MAIL_USERNAME or 'noreply@college.edu')

# Ensure upload directory exists (even /tmp/uploads)
if not os.path.exists(Config.UPLOAD_FOLDER):
    try:
        os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    except Exception:
        pass
