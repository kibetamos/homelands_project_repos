# case-resolution
This repository contains code that performs resolution on a new case with old cases. This involves getting related cases such appeals or other cases with the same case number.

## Folder Structure
1. [data](data): This folder contains sample data scraped.
         
     [data/clean_acts.txt](data/clean_acts.txt): This text file contains list of acts used.
3. [scripts](scripts): This folder contains the scripts used.
   1. [scripts/case_matcher.py](scripts/case_matcher.py): This script contains a module to resolve whether two cases are related.
   2. [scripts/cleaner.py](scripts/cleaner.py): This script cleans the text in cases.
   3. [scripts/entity_extractor.py](scripts/entity_extractor.py): This script conducts legal NER from text.
   4. [scripts/extract_acts.py](scripts/extract_acts.py): This script extracts acts referenced in cases.
   5. [scripts/import_data.py](scripts/import_data.py): This script imports data into a mongo database.
   6. [scripts/resolve_categories.py](scripts/resolve_categories.py): This resolves case categories using the acts mentioned in a case.
   
## **How to run**
1. Setup python environment
   
        python -m venv venv
2. Activate the environment

        source venv/bin/activate
3. Clone the project
    
        git clone https://github.com/no-name-organization111/case-resolution.git

        cd case-resolution

4. Install required libraries

         pip install -r requirements.txt

### **NB:**

In the next step ensure you have edited the code inside to add applicable credentials for the database.


5. To resolve new cases with older cases stored in database and store the cases in the database

        python scripts/import_data.py path_to_json_file
    
