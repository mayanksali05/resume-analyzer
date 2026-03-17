from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

def calculate_skill_score(student_skills, required_skills):
    if not required_skills:
        return 0
    matched_skills = [s for s in student_skills if s in required_skills]
    return len(matched_skills) / len(required_skills)

def calculate_tfidf_similarity(student_text, job_description):
    if not student_text or not job_description:
        return 0
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([student_text, job_description])
        similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
        return float(similarity[0][0])
    except:
        return 0

def rank_candidate(student, job):
    skill_score = calculate_skill_score(student.get('skills', []), job.get('required_skills', []))
    tfidf_score = calculate_tfidf_similarity(student.get('resume_text', ''), job.get('job_description', ''))
    
    # Normalize factors (capped at 1.0)
    # CGPA normalized against 10 (reasonable max)
    cgpa_factor = min(student.get('cgpa', 0) / 10, 1.0)
    # 4 keywords = full score in exp/projects
    exp_factor = min(student.get('experience_score', 0) / 4, 1.0) 
    proj_factor = min(student.get('projects_score', 0) / 4, 1.0)   

    # Holistic Weighted Score: 
    # 40% Skills + 20% CGPA + 15% Experience + 15% Projects + 10% TF-IDF
    final_score = (0.40 * skill_score) + \
                  (0.20 * cgpa_factor) + \
                  (0.15 * exp_factor) + \
                  (0.15 * proj_factor) + \
                  (0.10 * tfidf_score)
    
    return {
        "score": round(final_score, 4),
        "matched_skills": [s for s in student.get('skills', []) if s in job.get('required_skills', [])],
    }
