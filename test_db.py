from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://arnavpanda124:j50jB2JEqs2E2q6F@cluster0.n1856.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
try:
    client = MongoClient(uri, server_api=ServerApi('1'), serverSelectionTimeoutMS=2000)
    db = client['college_management']
    users = list(db['users'].find({'role': 'student'}))
    print("Success")
except Exception as e:
    print(f"Failed: {e}")
