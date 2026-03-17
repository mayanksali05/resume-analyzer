from pymongo import MongoClient

# Use the same URI as in config.py
MONGO_URI = "mongodb://localhost:27017/campus_placement"
client = MongoClient(MONGO_URI)
db = client.get_database()
users_collection = db.users

# Default Admin Credentials
admin_user = {
    "email": "admin@college.edu",
    "password": "admin123",
    "role": "placement_admin"
}

# Check if user exists, otherwise insert
if not users_collection.find_one({"email": admin_user["email"]}):
    users_collection.insert_one(admin_user)
    print("Default admin created successfully.")
else:
    print("Admin already exists.")

client.close()
