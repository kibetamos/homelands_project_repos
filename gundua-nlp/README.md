# **Gundua NLP**
This is the current backend for the Gundua Project. It contains the NLP capabilities of the application.

## **Folder structure**
1. [retrieve_cases.py](retrieve_cases.py): This is the module that handles getting cases whether a full text, similarity or no search.
2. [settings.py](settings.py): This is the module that handles any settings for the FastAPI app.
3. [similar_search.py](similar_search.py): This is the module that handles generating similarity scores.
4. [summarize_doc.py](summarize_doc.py): This is the module that handles summarizing documents.
5. [main.py](main.py): This is the main app module.

## **How to run**

1. Setup python environment
   
        python -m venv nlp-env
2. Activate the environment

        source nlp-env/bin/activate
3. Clone the project
    
        git clone https://github.com/no-name-organization111/gundua-nlp.git

        cd gundua-nlp

4. Install required libraries

        pip3 install -r requirements.txt

5. Run
    
        uvicorn main:app --reload

6. Go to http://127.0.0.1:8000/docs to visualize the APIs. You can also run the [Gundua UI](https://github.com/no-name-organization111/gundua-ui).
