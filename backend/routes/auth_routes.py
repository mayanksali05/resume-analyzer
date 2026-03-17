from flask import Blueprint, request, jsonify
from models.database import users_collection
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400
        
    users_collection.insert_one({
        "email": email,
        "password": password, # In production, use hashing like bcrypt
        "role": "placement_admin"
    })
    return jsonify({"message": "Admin registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users_collection.find_one({"email": email, "password": password})
    if user:
        return jsonify({"message": "Login successful", "email": email, "role": user['role']}), 200
    return jsonify({"message": "Invalid credentials"}), 401
