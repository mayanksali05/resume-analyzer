# Campus Placement Resume Analyzer System

A full-stack web application designed for college placement cells to manage student resumes, company drives, and automate the shortlisting process based on academic eligibility and skill matching.

## Features

- **Admin Authentication**: Restricted access for placement cell administrators.
- **Resume Upload & Parsing**: Automatically extracts skills and candidate info from PDF resumes.
- **Job Drive Management**: Create company-specific requirements (Min CGPA, Allowed Branches, Skills).
- **Automated Eligibility Filtering**: Instantly filters students who meet the academic criteria.
- **Smart Ranking**: Ranks candidates based on Skill Match and TF-IDF similarity between resume and job description.
- **Premium UI**: Clean, responsive dashboard with analytics and easy navigation.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons, Axios.
- **Backend**: Flask (Python), MongoDB (PyMongo), Scikit-learn (TF-IDF).
- **Database**: MongoDB.

## Getting Started

### Backend Setup
1. Navigate to `/backend`.
2. Install dependencies: `pip install -r requirements.txt`.
3. Create a `.env` file (optional, defaults provided in `config.py`).
4. Run the app: `python app.py`.

### Frontend Setup
1. Navigate to `/frontend`.
2. Install dependencies: `npm install`.
3. Start the dev server: `npm run dev`.

## Usage Flow
1. **Login**: Use the admin portal. (Default: Any credentials if registering first).
2. **Register Admin**: Go to `/auth/register` (API) or implement a signup page.
3. **Upload Students**: Add student details and upload resumes.
4. **Create Job**: Define company drive requirements.
5. **Generate Ranking**: Select a job drive and click "Generate Rankings".
