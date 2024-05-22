import spacy
import json

"""
This module extracts entities from cases.
"""
json_path = "/home/amos/Desktop/Homelands/case_resolution/data/sample_cases.json"
with open(json_path, 'r', encoding='utf-8') as json_file:
        cases = json.load(json_file)

case = cases[46]
text = ' '.join(case['judgement'])

# Load the model (using the en_core_web_sm model for demonstration purposes)
nlp = spacy.load("en_core_web_sm")

# Apply the model to the text
doc = nlp(text)

# Iterate through the entities identified by the model
for ent in doc.ents:
    label = ent.label_
    if label == 'JUDGE':
        print(ent.text, ent.label_)
