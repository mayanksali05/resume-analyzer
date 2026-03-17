from flask import Blueprint, request, jsonify
from models.database import users_collection
from werkzeug.security import generate_password_hash, check_password_hash
from flask_mail import Message
from extensions import mail
import random
import string

auth_bp = Blueprint('auth', __name__)

def generate_verification_code():
    return ''.join(random.choices(string.digits, k=6))

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    name = data.get('name', 'Admin')
    
    if users_collection.find_one({"email": email}):
        return jsonify({"message": "User already exists"}), 400
        
    verification_code = generate_verification_code()
    hashed_password = generate_password_hash(password)
    
    users_collection.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": "placement_admin",
        "is_verified": False,
        "verification_code": verification_code
    })
    
    try:
        from flask import current_app
        msg = Message("Verify your Email - Campus Placement Analyzer",
                      sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
                      recipients=[email])
        msg.body = f"Hello {name},\n\nYour verification code is: {verification_code}\n\nPlease enter this code to verify your account."
        mail.send(msg)
    except Exception as e:
        print(f"Error sending email: {e}")
        # In a real app, you might want to handle this more gracefully
        return jsonify({"message": "User registered but error sending email", "email": email}), 201

    return jsonify({"message": "Account created! Please check your email for verification code.", "email": email}), 201

@auth_bp.route('/verify', methods=['POST'])
def verify():
    data = request.json
    email = data.get('email')
    code = data.get('code')
    
    user = users_collection.find_one({"email": email, "verification_code": code})
    if user:
        users_collection.update_one({"email": email}, {"$set": {"is_verified": True}, "$unset": {"verification_code": ""}})
        return jsonify({"message": "Email verified successfully!"}), 200
    
    return jsonify({"message": "Invalid verification code"}), 400

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    user = users_collection.find_one({"email": email})
    
    if user and check_password_hash(user['password'], password):
        if not user.get('is_verified', False):
            return jsonify({"message": "Please verify your email first", "not_verified": True}), 403
            
        return jsonify({
            "message": "Login successful", 
            "email": email, 
            "role": user['role'],
            "name": user.get('name', 'Admin')
        }), 200
        
    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/resend-code', methods=['POST'])
def resend_code():
    data = request.json
    email = data.get('email')
    
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    if user.get('is_verified'):
        return jsonify({"message": "User is already verified"}), 400
        
    verification_code = generate_verification_code()
    users_collection.update_one({"email": email}, {"$set": {"verification_code": verification_code}})
    
    try:
        from flask import current_app
        msg = Message("Verify your Email - Campus Placement Analyzer",
                      sender=current_app.config.get('MAIL_DEFAULT_SENDER'),
                      recipients=[email])
        msg.body = f"Hello,\n\nYour new verification code is: {verification_code}"
        mail.send(msg)
        return jsonify({"message": "Verification code resent!"}), 200
    except Exception as e:
        return jsonify({"message": "Error sending email"}), 500
