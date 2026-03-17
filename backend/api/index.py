import sys
import os

# Add current backend directory to sys.path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app import create_app

# Vercel expects the app instance to be exported as 'app'
app = create_app()

@app.route('/api')
def api_index():
    return {"message": "Backend API is live at /api"}
