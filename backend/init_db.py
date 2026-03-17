from pymongo import MongoClient
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

load_dotenv()

def init_atlas():
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        print("Error: MONGO_URI not found in .env")
        return

    print("Connecting to MongoDB Atlas...")
    client = MongoClient(mongo_uri)
    db = client.get_database() # This uses the database name from the URI (campus_placement)
    
    users_collection = db.users
    
    # Check if admin already exists
    admin_email = "admin@college.edu"
    if users_collection.find_one({"email": admin_email}):
        users_collection.update_one({"email": admin_email}, {"$set": {"is_verified": True}})
        print("Admin user already exists and is now verified.")
    else:
        admin_user = {
            "name": "Placement Admin",
            "email": admin_email,
            "password": generate_password_hash("admin123"),
            "role": "admin",
            "is_verified": True
        }
        users_collection.insert_one(admin_user)
        print(f"Admin user created: {admin_email} / admin123")
    
    # Create other collections implicitly by inserting dummy/metadata if needed
    # or just let the app handle it.
    print("Database initialized successfully!")

if __name__ == "__main__":
    init_atlas()
