from pymongo import MongoClient
from config import Config

client = MongoClient(Config.MONGO_URI)
db = client.get_database()

students_collection = db.students
jobs_collection = db.jobs
rankings_collection = db.rankings
users_collection = db.users
