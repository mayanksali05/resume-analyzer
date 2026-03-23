from flask import Blueprint, request, jsonify
from models.database import jobs_collection
from datetime import datetime

job_bp = Blueprint('job', __name__)

@job_bp.route('/create_job', methods=['POST'])
def create_job():
    data = request.json
    admin_email = request.headers.get('X-User-Email')
    job_data = {
        "admin_email": admin_email,
        "company_name": data.get('company_name'),
        "job_role": data.get('job_role'),
        "job_description": data.get('job_description'),
        "required_skills": data.get('required_skills', []),
        "min_cgpa": float(data.get('min_cgpa', 0)),
        "allowed_branches": data.get('allowed_branches', []),
        "created_at": datetime.utcnow()
    }
    jobs_collection.insert_one(job_data)
    return jsonify({"message": "Job drive created successfully"}), 201

@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    admin_email = request.headers.get('X-User-Email')
    jobs = list(jobs_collection.find({"admin_email": admin_email}))
    for j in jobs:
        j['_id'] = str(j['_id'])
    return jsonify(jobs), 200

@job_bp.route('/jobs/<job_id>', methods=['PUT'])
def update_job(job_id):
    from bson import ObjectId
    data = request.json
    admin_email = request.headers.get('X-User-Email')
    update_data = {
        "company_name": data.get('company_name'),
        "job_role": data.get('job_role'),
        "job_description": data.get('job_description'),
        "required_skills": data.get('required_skills', []),
        "min_cgpa": float(data.get('min_cgpa', 0)),
        "allowed_branches": data.get('allowed_branches', []),
        "updated_at": datetime.utcnow()
    }
    result = jobs_collection.update_one({
        "_id": ObjectId(job_id),
        "admin_email": admin_email
    }, {"$set": update_data})
    
    if result.matched_count == 0:
        return jsonify({"message": "Job drive not found or unauthorized"}), 404
        
    return jsonify({"message": "Job drive updated successfully"}), 200

@job_bp.route('/jobs/<job_id>', methods=['DELETE'])
def delete_job(job_id):
    from bson import ObjectId
    admin_email = request.headers.get('X-User-Email')
    result = jobs_collection.delete_one({
        "_id": ObjectId(job_id),
        "admin_email": admin_email
    })
    
    if result.deleted_count == 0:
        return jsonify({"message": "Job drive not found or unauthorized"}), 404
        
    return jsonify({"message": "Job drive deleted successfully"}), 200
