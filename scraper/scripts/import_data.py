import pymongo
import json
from pymongo import MongoClient, InsertOne

"""
This script imports data in bulk to a mongodb database.
"""

# Setup connection to mongo db
client = pymongo.MongoClient("localhost", 27017)

# Get the database
db = client.aam

"""
This section is commented out but can be swaped for
when one wants to import to cases instead.
"""
# Import cases
collection = db.cases
with open('data/related1.json') as f:
    file_data = json.load(f)

collection.insert_many(file_data)

# Import acts
# collection = db.acts
# with open('acts.json') as f:
#     file_data = json.load(f)
    
# collection.insert_many(file_data)
client.close()