# Scraper
This repository includes the scripts used to scrape data.

## Folder Structure
1. [data](data): This folder contains sample data scraped.
2. [scripts](scripts): This folder contains the scripts used.
   1. [acts_scraper.py](scripts/acts_scraper.py): This script scrapes acts data from Kenya Law website.
   2. [cases_scraper.py](scripts/cases_scraper.py): This script scrapes cases data from Kenya Law website.
   3. [import_data.py](scripts/import_data.py): This script imports data into a mongo database.

## **How to run**
1. Setup python environment
   
        python -m venv scraper-env
2. Activate the environment

        source scraper-env/bin/activate
3. Clone the project
    
        git clone https://github.com/no-name-organization111/scraper.git

        cd scraper

4. Install required libraries

        pip3 install beautifulsoup4

### **NB:**

In the next steps ensure you have edited the code inside to add applicable or credentials for the database.


5. To scrape the data
    
        python3 scripts/cases_scraper.py

    Or

        python3 scripts/acts_scraper.py

6. To import scraped data

        python scripts/import_data.py