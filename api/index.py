import sys
import os

# Add backend directory to sys.path so we can import from it
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app import create_app

# Vercel expects the app instance to be exported as 'app'
app = create_app()
