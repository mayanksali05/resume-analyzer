from flask import Blueprint, request, jsonify
from models.database import jobs_collection
from datetime import datetime

job_bp = Blueprint('job', __name__)

@job_bp.route('/create_job', methods=['POST'])
def create_job():
    data = request.json
    job_data = {
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
    jobs = list(jobs_collection.find())
    for j in jobs:
        j['_id'] = str(j['_id'])
    return jsonify(jobs), 200
