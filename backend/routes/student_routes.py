import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from config import Config
from models.database import students_collection
from utils.pdf_reader import extract_text_from_pdf
from utils.text_cleaner import clean_text
from services.resume_parser import parse_resume

student_bp = Blueprint('student', __name__)

@student_bp.route('/upload_student', methods=['POST'])
def upload_student():
    if 'resume' not in request.files:
        return jsonify({"message": "No file part"}), 400
    
    file = request.files['resume']
    name = request.form.get('name')
    email = request.form.get('email')
    phone = request.form.get('phone')
    branch = request.form.get('branch')
    cgpa = float(request.form.get('cgpa', 0))
    
    if file.filename == '':
        return jsonify({"message": "No selected file"}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Process Resume
        raw_text = extract_text_from_pdf(filepath)
        cleaned_text = clean_text(raw_text)
        parsed_data = parse_resume(raw_text)
        
        student_data = {
            "name": name or parsed_data['name'],
            "email": email,
            "phone": phone,
            "branch": branch,
            "cgpa": cgpa,
            "skills": parsed_data['skills'],
            "education": parsed_data['education'],
            "experience_score": parsed_data.get('experience_score', 0),
            "projects_score": parsed_data.get('projects_score', 0),
            "resume_text": cleaned_text,
            "resume_file_path": filepath
        }
        
        students_collection.insert_one(student_data)
        return jsonify({"message": "Student uploaded and processed successfully"}), 201

@student_bp.route('/students', methods=['GET'])
def get_students():
    students = list(students_collection.find({}, {"resume_text": 0}))
    for s in students:
        s['_id'] = str(s['_id'])
    return jsonify(students), 200

@student_bp.route('/bulk_upload', methods=['POST'])
def bulk_upload():
    if 'resumes' not in request.files:
        return jsonify({"message": "No files part"}), 400
    
    files = request.files.getlist('resumes')
    results = []
    
    for file in files:
        if file.filename == '':
            continue
            
        filename = secure_filename(file.filename)
        filepath = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(filepath)
        
        # Process Resume
        raw_text = extract_text_from_pdf(filepath)
        cleaned_text = clean_text(raw_text)
        parsed_data = parse_resume(raw_text)
        
        student_data = {
            "name": parsed_data['name'],
            "email": parsed_data['email'],
            "phone": parsed_data['phone'],
            "branch": parsed_data['branch'],
            "cgpa": parsed_data['cgpa'],
            "skills": parsed_data['skills'],
            "education": parsed_data['education'],
            "experience_score": parsed_data.get('experience_score', 0),
            "projects_score": parsed_data.get('projects_score', 0),
            "resume_text": cleaned_text,
            "resume_file_path": filepath
        }
        
        students_collection.insert_one(student_data)
        results.append({"filename": filename, "status": "processed"})
        
    return jsonify({"message": f"Successfully processed {len(results)} resumes", "results": results}), 201

@student_bp.route('/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    from bson import ObjectId
    try:
        # Delete student
        result = students_collection.delete_one({"_id": ObjectId(student_id)})
        
        if result.deleted_count > 0:
            # Also cleanup rankings for this student
            from models.database import rankings_collection
            rankings_collection.delete_many({"student_id": student_id})
            return jsonify({"message": "Student removed successfully"}), 200
        else:
            return jsonify({"message": "Student not found"}), 404
    except Exception as e:
        return jsonify({"message": f"Error deleting student: {str(e)}"}), 500
