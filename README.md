# 🎓 Campus Placement Resume Analyzer & Ranker

A state-of-the-art recruitment automation system designed for college placement cells. This platform uses AI to parse resumes, verify eligibility, and rank candidates based on a holistic score composition of skills, experience, projects, and academics.

## 🚀 Key Features

-   **Holistic AI Ranking**: Moves beyond keyword matching to evaluate candidates based on:
    -   **40% Skills match** (NLP keyword extraction)
    -   **20% CGPA** (Academic performance)
    -   **15% Work Experience** (Internships/Jobs)
    -   **15% Personal Projects**
    -   **10% TF-IDF Similarity** (Contextual relevance)
-   **Smart Eligibility Filter**: Automated screening for Branch and CGPA criteria.
-   **Bulk Resume Processing**: Upload dozens of PDF resumes simultaneously.
-   **Automated Verification**: Email-based signup with 6-digit verification codes.
-   **Placement Management**: Create, edit, and delete job drives with custom criteria.
-   **Analytics Dashboard**: Real-time stats on student registrations and drive activity.
-   **Data Export**: Download ranked lists as CSV for official shortlisting.

---

## 🛠️ Tech Stack

-   **Frontend**: React.js, Vite, TailwindCSS, Lucide Icons.
-   **Backend**: Flask (Python), Flask-Mail (OTP verification).
-   **Database**: MongoDB Atlas (Cloud NoSQL).
-   **AI/ML**: Scikit-learn (TF-IDF Similarity), Regex-based NLP for extraction.

---

## 🏃 Getting Started

### Prerequisites
-   Python 3.8+
-   Node.js 16+
-   MongoDB Atlas Account

### 1. Clone the Repository
```bash
git clone https://github.com/mayanksali05/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv
# Activate it (Windows)
.\venv\Scripts\activate
# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration
Create a `.env` file in the `backend/` folder:
```env
MONGO_URI=your_mongodb_atlas_uri
SECRET_KEY=your_random_secret_key
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Running the Application
**Backend:**
```bash
cd backend
python app.py
```
**Frontend:**
```bash
cd frontend
npm run dev
```

---

## 🌐 Deployment (Vercel)

1.  Push your code to GitHub.
2.  Connect the repository to Vercel.
3.  Set the **Build Command**: `cd frontend && npm install && npm run build`
4.  Set the **Output Directory**: `frontend/dist`
5.  Add your `.env` variables in Vercel settings.
6.  Set `VITE_API_BASE_URL` to `/api`.

---

## 📄 License
Distributed under the MIT License.
