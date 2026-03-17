def is_eligible(student, job):
    # CGPA Check
    if student.get('cgpa', 0) < job.get('min_cgpa', 0):
        return False
    
    # Branch Check
    allowed_branches = [b.upper() for b in job.get('allowed_branches', [])]
    if student.get('branch', '').upper() not in allowed_branches:
        return False
        
    return True
