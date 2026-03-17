from flask import Flask
from flask_cors import CORS
from config import Config
from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from routes.job_routes import job_bp
from routes.ranking_routes import ranking_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app)
    
    # Register Blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(student_bp, url_prefix='/student')
    app.register_blueprint(job_bp, url_prefix='/job')
    app.register_blueprint(ranking_bp, url_prefix='/ranking')
    
    @app.route('/')
    def index():
        return {"message": "Campus Placement Resume Analyzer API is running!"}
        
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
