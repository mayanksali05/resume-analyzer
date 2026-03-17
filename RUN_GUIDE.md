# Complete Setup & Execution Guide

This document provides a step-by-step walkthrough to get your **Campus Placement Resume Analyzer** running locally and deployed to the cloud.

---

## Prerequisites

Before you begin, ensure you have the following installed:
-   **Python 3.10+**
-   **Node.js 18+**
-   **Git**
-   **MongoDB Atlas Account** (Free tier works perfectly)

---

## Phase 1: Local Development Setup

### 1. Clone the Repository
```bash
git clone https://github.com/mayanksali05/resume-analyzer.git
cd resume-analyzer
```

### 2. Backend Configuration (Python/Flask)
Navigate to the backend folder and set up a virtual environment:
```bash
cd backend
python -m venv venv

# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies:
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)
Create a file named `.env` in the `backend/` directory and fill in your credentials:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/placement_db
SECRET_KEY=any_random_secure_string
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USE_TLS=True
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
MAIL_DEFAULT_SENDER=your_gmail@gmail.com
```

> [!TIP]
> To get a `MAIL_PASSWORD`, you must use a **Gmail App Password**. Go to your Google Account > Security > 2-Step Verification > App Passwords.

---

## Phase 2: Database Setup (MongoDB Atlas)

1.  Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  Create a new Cluster (Shared/Free).
3.  **Network Access**: Go to "Network Access" and click **Add IP Address**. Choose **"Allow Access From Anywhere"** (0.0.0.0/0). This is required for Vercel.
4.  **Database Access**: Create a database user with Read/Write permissions.
5.  **Connection String**: Click **Connect** > **Drivers** > **Python** and copy the URI. Replace `<password>` with your user password.

---

## Phase 3: Frontend Setup (React/Vite)

Open a new terminal window in the root directory:
```bash
cd frontend
npm install
```

---

## Phase 4: Running the App Locally

You need **two** terminals running simultaneously:

**Terminal 1 (Backend):**
```bash
cd backend
.\venv\Scripts\activate
python app.py
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

Visit `http://localhost:5173` to view the application!

---

## Phase 5: Cloud Deployment (Vercel)

### 1. GitHub Push
Ensure all your changes are pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Vercel Configuration
1.  Import your GitHub repo into [Vercel](https://vercel.com).
2.  **Strict Settings**:
    -   **Framework Preset**: Vite
    -   **Root Directory**: `./`
    -   **Build Command**: `cd frontend && npm install && npm run build`
    -   **Output Directory**: `frontend/dist`
3.  **Environment Variables**:
    Add these in the Settings > Environment Variables tab:
    -   `VITE_API_BASE_URL` = `/api`
    -   `MONGO_URI` = (Your Atlas String)
    -   `SECRET_KEY` = (Your Secret Key)
    -   `MAIL_USERNAME` = (Your Gmail)
    -   `MAIL_PASSWORD` = (Your App Password)

---

## Verification Steps
1.  **Register**: Create a new account and verify via the OTP sent to your email.
2.  **Job Drive**: Create a new drive (e.g., Google SDE).
3.  **Upload**: Bulk upload 5-10 resumes in the **Student Management** section.
4.  **Rank**: Go to **Rankings**, select your job drive, and click **Generate Rankings**.

---

> [!IMPORTANT]
> If you see a "Criteria Not Met" message for all resumes, ensure your Job Drive's **Allowed Branches** matches the branches found in the resumes (e.g., CSE, IT).
