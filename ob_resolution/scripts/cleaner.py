# import pandas as pd

# def clean_text(text):
#     """
#     This function cleans text

#     Args:
#     text: string to be cleaned

#     Returns:
#     clean_text: cleaned text
#     """
#     clean_text = text.strip()
#     clean_text = clean_text.replace('\n', '')
#     clean_text = clean_text.replace('\t', '')
#     return clean_text

# def clean_date(date):
#     """
#     This function cleans the date

#     Args:
#     date: date to be cleaned

#     Returns:
#     cleaned_date: cleaned date
#     """    
#     df = pd.Series(date)
#     df = pd.to_datetime(df)
#     df = df.dt.strftime('%Y-%m-%d')
#     cleaned_date = df.iloc[0]
#     return cleaned_date

# def clean_dict(a_dict):
#     """
#     This function cleans meta info and 
#     parties info dictionaries.

#     Args:
#     a_dict: dict to be cleaned

#     Returns:
#     a_dict: cleaned dict
#     """    
#     for key,value in a_dict.items():
#         clean_value = clean_text(value)        

#         if key == "Date Delivered: ":
#             clean_value = clean_date(value)

#         a_dict.update({key:clean_value})
#     return a_dict

# def clean_case(case_dict):

#     """
#     This functions cleans text inside a case dictionary.

#     Args:
#     case_dict: A dictionary containing the case

#     Returns:
#     case_dict: A cleaned up dictionary with the case.
#     """

#     for key,value in case_dict.items():
#         if type(value) is dict:
#             value = clean_dict(value)
            
#         elif type(value) is str:
#             value = clean_text(value)
            
#         elif type(value) is list:
#             clean_value = []
#             for v in value:
#                 clean_v = clean_text(v)
#                 clean_value.append(clean_v)
#             value = clean_value
#         case_dict.update({key:value})

#     return case_dict

# def clean_cases(cases):
#     """
#     This functions cleans up a list of cases

#     Args:
#     cases: A list of cases

#     Returns:
#     cleaned_cases: A list of cleaned cases
#     """
#     cleaned_cases = []
#     for case in cases:
#         cleaned_case = clean_case(case)
#         cleaned_cases.append(cleaned_case)
#     return cleaned_cases


import json

# Load the JSON data from the file
with open('data/ob_sample.json', 'r') as file:
    data = json.load(file)

# Clean the data
for entry in data['entries']:
    entry['ob_number'] = entry['ob_number'].strip() if 'ob_number' in entry else ""
    entry['date'] = entry['date'].strip()
    entry['time'] = entry['time'].strip()
    entry['location'] = entry['location'].strip()
    entry['nature_of_occurrence'] = entry['nature_of_occurrence'].strip()
    entry['details'] = entry['details'].strip()
    entry['action_taken'] = entry['action_taken'].strip()
    
    if 'reporting_officer' in entry:
        entry['reporting_officer']['name'] = entry['reporting_officer']['name'].strip()
        entry['reporting_officer']['badge_id'] = entry['reporting_officer']['badge_id'].strip()
        entry['reporting_officer']['phone'] = entry['reporting_officer']['phone'].strip()
    
    for witness in entry['witnesses']:
        witness['name'] = witness['name'].strip()
        witness['contact'] = witness['contact'].strip()
        witness['phone'] = witness['phone'].strip()
    
    for accused in entry['accused']:
        accused['name'] = accused['name'].strip()
        accused['description'] = accused['description'].strip()
        accused['phone'] = accused['phone'].strip()

# Save the cleaned data back to the file
with open('cleaned_occurrence_book.json', 'w') as file:
    json.dump(data, file, indent=2)

print("Data cleaned and saved to 'cleaned_occurrence_book.json'")
