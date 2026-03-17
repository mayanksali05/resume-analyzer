import re
from services.skill_extractor import extract_skills

def parse_resume(text):
    # Enhanced parsing logic
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Name extraction (usually first line)
    name = lines[0] if lines else "Unknown"
    
    # Email extraction
    email_match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', text)
    email = email_match.group(0) if email_match else ""
    
    # Phone extraction
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = phone_match.group(0) if phone_match else ""
    
    # CGPA extraction (Match patterns like 8.5/10, GPA: 3.5, 9.2 CGPA)
    cgpa_match = re.search(r'(?:cgpa|gpa)[:\s]*(\d+\.\d+)', text, re.IGNORECASE)
    cgpa = float(cgpa_match.group(1)) if cgpa_match else 0.0
    
    # Branch detection
    branches = {
        "CSE": ["computer science", "cse", "software engineering"],
        "IT": ["information technology", " it "],
        "ECE": ["electronics", "ece", "communication"],
        "EE": ["electrical", "ee"],
        "ME": ["mechanical", "me"],
        "CE": ["civil", "ce"]
    }
    detected_branch = "Unknown"
    for branch, keywords in branches.items():
        if any(keyword in text.lower() for keyword in keywords):
            detected_branch = branch
            break

    skills = extract_skills(text)
    
    # Simple education extraction
    education = []
    edu_keywords = ["B.Tech", "M.Tech", "B.E", "Bachelor", "Degree", "University", "College", "School"]
    for keyword in edu_keywords:
        if keyword.lower() in text.lower():
            education.append(keyword)
            
    return {
        "name": name,
        "email": email,
        "phone": phone,
        "branch": detected_branch,
        "cgpa": cgpa,
        "skills": skills,
        "education": ", ".join(list(set(education)))
    }
