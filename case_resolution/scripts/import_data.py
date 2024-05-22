# import pymongo
# import json
# from bson import ObjectId
# from cleaner import clean_cases
# from case_matcher import CaseResolver
# from resolve_categories import CategoryResolver
# import sys

# """
# This script imports data in bulk to a mongodb database.
# For cases, this script assumes that there is no cases data.
# """

# # Get JSON file
# json_path = sys.argv[1]

# # Setup connection to mongo db
# client = pymongo.MongoClient("localhos", 27017)

# # Get the database
# db = client.presentation


# # Read JSON files
# collection = db.cases
# with open(json_path) as f:
#     file_data = json.load(f)

# # Clean data
# cleaned_cases = clean_cases(file_data)

# # Instantiate CaseResolver
# case_resolver = CaseResolver()

# # Instantiate CategoryResolver
# cr = CategoryResolver()

# # Import first case
# f_case = cleaned_cases[0]
# f_case.update({'case_number':f_case['meta_info']['Case Number:']})
# f_case.update({'related_cases':[]})
# f_case.update({'_id':'0'})

# # Add categories
# case_text = ' '.join(f_case['judgement'])

# # resolved_acts = cr.resolve_acts(case_text)
# resolved_acts = cr.resolve_acts(case_text)

# resolved_charges = cr.resolve_charges(case_text)
# # f_case.update({'resolved_acts':list(set(resolved_acts))})
# f_case.update({'resolved_charges':list(set(resolved_charges))})

# collection.insert_one(f_case)

# # Import the rest of the data
# for case_id, case in enumerate(cleaned_cases[1:], 1):

#     case_id = str(case_id)

#     # Get the cases aleady available
#     stored_cases = list(collection.find({}, {'_id': {'$toString': "$_id"}, 'meta_info':1,
#                                             'parties_info':1,  'judgement':1,
#                                             'case_url':1, "case_number":1, "related_cases":1}))

#     # If there is information
#     if case.get('meta_info') and case.get('parties_info'):

#         # Get case number
#         case_number = case['meta_info']['Case Number:']

#         # Define list of related case
#         related_cases = []
        
#         # Iterate old cases to find any related cases
#         for old_case in stored_cases:

#             # Get the case number of older case
#             old_case_number = old_case['case_number']

#             # Check if the older case and new case match numbers
#             if case_resolver.exact_match(old_case_number, case_number):
#                 case.update({'case_number':old_case_number})
            
#             # Otherwise check if there are related
#             else:

#                 # Check if the new case is related to an older stored case            
#                 if case_resolver.relate_parties(case['parties_info'], old_case['parties_info']):

#                     # Add to related cases of both the old and new case
#                     related_cases.append(old_case['_id'])
#                     old_case['related_cases'].append(case_id)
#                     collection.update_one({'_id':old_case['_id']}, {"$set": old_case}, upsert=False)

#         # Update the new case
#         case.update({'related_cases':related_cases})
#         if not case.get('case_number'):
#             case.update({'case_number':case_number})

#         case.update({'_id':case_id})
#         case_text = ' '.join(case['judgement'])

#         # Add categories
#         resolved_acts = cr.resolve_acts(case_text)
#         resolved_charges = cr.resolve_charges(case_text)
#         case.update({'resolved_acts':list(set(resolved_acts))})
#         case.update({'resolved_charges':list(set(resolved_charges))})
        
#         collection.insert_one(case)

# """
# This section is commented out but can be swaped for
# when one wants to import to cases instead.
# """ 

# # Import acts
# # collection = db.acts
# # with open('acts.json') as f:
# #     file_data = json.load(f)
    
# # collection.insert_many(file_data)
# client.close()


import pymongo
import json
from bson import ObjectId
from cleaner import clean_cases
from case_matcher import CaseResolver
from resolve_categories import CategoryResolver
import sys

"""
This script imports data in bulk to a mongodb database.
For cases, this script assumes that there is no cases data.
"""

# Get JSON file
json_path = sys.argv[1]

# Setup connection to mongo db
client = pymongo.MongoClient("localhost", 27017)

# Get the database
db = client.fg12


# Read JSON files
collection = db.case
with open(json_path) as f:
    file_data = json.load(f)

# Clean data
cleaned_cases = clean_cases(file_data)

# Instantiate CaseResolver
case_resolver = CaseResolver()

# Instantiate CategoryResolver
cr = CategoryResolver()

# Import first case
f_case = cleaned_cases[0]
f_case.update({'case_number':f_case['meta_info']['Case Number:']})
f_case.update({'related_cases':[]})
f_case.update({'_id':'0'})

# Add categories
case_text = ' '.join(f_case['judgement'])
resolved_acts = cr.resolve_acts(case_text)
resolved_charges = cr.resolve_charges(case_text)
f_case.update({'resolved_acts':list(set(resolved_acts))})
f_case.update({'resolved_charges':list(set(resolved_charges))})

collection.insert_one(f_case)

# Import the rest of the data
for case_id, case in enumerate(cleaned_cases[1:], 1):

    case_id = str(case_id)

    # Get the cases aleady available
    stored_cases = list(collection.find({}, {'_id': {'$toString': "$_id"}, 'meta_info':1,
                                            'parties_info':1,  'judgement':1,
                                            'case_url':1, "case_number":1, "related_cases":1, "referenced_cases":1}))

    # If there is information
    if case.get('meta_info') and case.get('parties_info'):

        # Get case number
        case_number = case['meta_info']['Case Number']

        # Define list of related case
        related_cases = []
        
        # Iterate old cases to find any related cases
        for old_case in stored_cases:

            # Get the case number of older case
            old_case_number = old_case['case_number']

            # Check if the older case and new case match numbers
            if case_resolver.exact_match(old_case_number, case_number):
                case.update({'case_number':old_case_number})
            
            # Otherwise check if there are related
            else:

                # Check if the new case is related to an older stored case            
                if case_resolver.relate_parties(case['parties_info'], old_case['parties_info']):

                    # Add to related cases of both the old and new case
                    related_cases.append(old_case['_id'])
                    old_case['related_cases'].append(case_id)
                    collection.update_one({'_id':old_case['_id']}, {"$set": old_case}, upsert=False)

        # Update the new case
        case.update({'related_cases':related_cases})
        if not case.get('case_number'):
            case.update({'case_number':case_number})

        case.update({'_id':case_id})
        case_text = ' '.join(case['judgement'])

        # Add categories
        resolved_acts = cr.resolve_acts(case_text)
        resolved_charges = cr.resolve_charges(case_text)
        case.update({'resolved_acts':list(set(resolved_acts))})
        case.update({'resolved_charges':list(set(resolved_charges))})
        
        collection.insert_one(case)

"""
This section is commented out but can be swaped for
when one wants to import to cases instead.
""" 

# Import acts
# collection = db.acts
# with open('acts.json') as f:
#     file_data = json.load(f)
    
# collection.insert_many(file_data)
client.close()
