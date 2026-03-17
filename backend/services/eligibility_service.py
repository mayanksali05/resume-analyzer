def is_eligible(student, job):
    # CGPA Check (Smart Filter)
    # Only reject if CGPA is detected (>0) and falls below minimum
    min_cgpa = job.get('min_cgpa', 0)
    student_cgpa = student.get('cgpa', 0)
    if min_cgpa > 0 and student_cgpa > 0 and student_cgpa < min_cgpa:
        return False
    
    # Branch Check
    allowed_branches = [b.upper() for b in job.get('allowed_branches', [])]
    if student.get('branch', '').upper() not in allowed_branches:
        return False
        
    return True
