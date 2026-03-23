from flask import Blueprint, request, jsonify, Response
import io
import csv
from bson import ObjectId
from models.database import students_collection, jobs_collection, rankings_collection
from services.eligibility_service import is_eligible
from services.ranking_service import rank_candidate

ranking_bp = Blueprint('ranking', __name__)

@ranking_bp.route('/rank_students', methods=['POST'])
def rank_students():
    data = request.json
    job_id = data.get('job_id')
    admin_email = request.headers.get('X-User-Email')
    
    # Ensure job belongs to this admin
    job = jobs_collection.find_one({"_id": ObjectId(job_id), "admin_email": admin_email})
    if not job:
        return jsonify({"message": "Job not found or unauthorized"}), 404
        
    students = list(students_collection.find({"admin_email": admin_email}))
    
    # Clear previous rankings for this job
    rankings_collection.delete_many({"job_id": job_id, "admin_email": admin_email})
    
    final_rankings = []
    for student in students:
        eligible = is_eligible(student, job)
        
        ranking_item = {
            "admin_email": admin_email,
            "job_id": job_id,
            "student_id": str(student['_id']),
            "student_name": student['name'],
            "branch": student['branch'],
            "cgpa": student['cgpa'],
            "email": student.get('email', 'N/A')
        }

        if eligible:
            result = rank_candidate(student, job)
            ranking_item.update({
                "score": result['score'],
                "matched_skills": result['matched_skills'],
                "eligibility_status": "eligible"
            })
        else:
            ranking_item.update({
                "score": 0,
                "matched_skills": [],
                "eligibility_status": "rejected",
                "rejection_reason": "Criteria Not Met (CGPA/Branch)"
            })
            
        final_rankings.append(ranking_item)

    # Sort: Eligible first, then by score descending
    final_rankings.sort(key=lambda x: (x['eligibility_status'] == 'rejected', -x['score']))
    
    if final_rankings:
        rankings_collection.insert_many(final_rankings)
        for r in final_rankings:
            r['_id'] = str(r['_id'])
        
    return jsonify(final_rankings), 200

@ranking_bp.route('/rankings/<job_id>', methods=['GET'])
def get_rankings(job_id):
    admin_email = request.headers.get('X-User-Email')
    rankings = list(rankings_collection.find({
        "job_id": job_id,
        "admin_email": admin_email
    }).sort("score", -1))
    for r in rankings:
        r['_id'] = str(r['_id'])
    return jsonify(rankings), 200
@ranking_bp.route('/rankings/<job_id>/download', methods=['GET'])
def download_rankings_csv(job_id):
    admin_email = request.headers.get('X-User-Email')
    rankings = list(rankings_collection.find({
        "job_id": job_id,
        "admin_email": admin_email
    }).sort("score", -1))
    
    if not rankings:
        return jsonify({"message": "No rankings found for this job"}), 404
        
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(['Rank', 'Name', 'Branch', 'CGPA', 'Match Score', 'Skills Matched'])
    
    for i, r in enumerate(rankings):
        writer.writerow([
            i + 1,
            r.get('student_name', ''),
            r.get('branch', ''),
            r.get('cgpa', ''),
            r.get('score', ''),
            ", ".join(r.get('matched_skills', []))
        ])
        
    output.seek(0)
    
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-disposition": f"attachment; filename=rankings_{job_id}.csv"}
    )
