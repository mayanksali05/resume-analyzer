import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/campus_placement")
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key")
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf'}

if not os.path.exists(Config.UPLOAD_FOLDER):
    os.makedirs(Config.UPLOAD_FOLDER)
