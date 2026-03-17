import re

SKILLS_LIST = [
    "Python", "Java", "SQL", "Machine Learning", "React", "Node.js", 
    "Data Analysis", "Deep Learning", "HTML", "CSS", "JavaScript", 
    "C++", "C#", "AWS", "Docker", "Kubernetes", "Git", "C"
]

def extract_skills(text):
    extracted_skills = []
    text_lower = text.lower()
    for skill in SKILLS_LIST:
        # Use word boundaries to avoid matching sub-strings (e.g., 'C' in 'CAT')
        pattern = rf'\b{re.escape(skill.lower())}\b'
        if re.search(pattern, text_lower):
            extracted_skills.append(skill)
    return list(set(extracted_skills))
