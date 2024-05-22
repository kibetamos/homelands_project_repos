from fastapi import FastAPI, File, UploadFile
from retrieve_cases import *
from summarize_doc import summarize
import shutil
from webbrowser import get
from docx import Document
from io import BytesIO
from settings import app
from pydantic import BaseModel

# Request data definition
class RequestData(BaseModel):
    source_text: str 


@app.get("/cases/")
async def list_all():
    # Get all the cases in the database
    cases = get_cases()
    return cases

@app.get("/cases/{case_id}")
async def list_specific_case(case_id):
    # Get a specific case based on its object id
    cases = get_case(case_id)
    return cases[0]

@app.get("/fulltext/cases/{text}")
async def list_fulltext_cases(text):
    # Perform a full text search on cases
    cases = full_text_search(text)
    return cases

@app.post("/similar/")
async def list_similar(data: RequestData):
    # Get cases similar to the passed text
    cases = get_similar_cases(data.source_text)
    return {'cases':cases}

@app.post("/summarize/")
async def summarize_document(file: UploadFile = File(...)):

    # Read the document uploaded
    doc = Document(BytesIO(await file.read()))

    # Join the paragraphs
    long_text = []
    for para in doc.paragraphs:
        long_text.append(para.text)
    long_text = '\n'.join(long_text)

    # Get summary of the document
    summary = summarize(long_text)
    
    return summary

@app.get("/categories/{text}")
async def list_categorized_cases(text):

    # Perform a category text search on cases
    categorized_cases = get_categorized_cases(text)
    
    return categorized_cases