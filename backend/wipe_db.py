from pymongo import MongoClient

MONGO_URI = "mongodb+srv://mishraranubala_db_user:VAyFxc8ASPbSljYT@cluster0.pwe9nug.mongodb.net/?appName=Cluster0"

client = MongoClient(MONGO_URI)
db = client['college_management']

# List of collections to wipe
collections = db.list_collection_names()
for coll in collections:
    db[coll].drop()
    print(f"Dropped collection: {coll}")

print("Database wiped completely.")
