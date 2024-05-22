import requests
import json
import logging
from bs4 import BeautifulSoup

logging.basicConfig(filename='scraper.log', level=logging.ERROR)

def get_case_info(case_url):
    try:
        response = requests.get(case_url)
        soup = BeautifulSoup(response.content, "html.parser")
        case_data = {}
        case_data["title"] = soup.find("h1").text.strip()
        case_data["citation"] = soup.find("div", class_="citation").text.strip()
        case_data["judges"] = soup.find("div", class_="judges").text.strip()
        case_data["summary"] = soup.find("div", class_="summary").text.strip()
        case_data["decision"] = soup.find("div", class_="decision").text.strip()
        return case_data
    except Exception as e:
        logging.error(f'Error occured while scraping case {case_url}')
        logging.error(e)

url = "http://kenyalaw.org/caselaw/cases/view/"
cases = []
for i in range(1000, 1005):
    case_url = url + str(i)
    case_data = get_case_info(case_url)
    if case_data:
        cases.append(case_data)

with open("cases.json", "w") as f:
    json.dump(cases, f)