from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import sys
import logging

# Ensure the backend directory is in the path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import rag_utils

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "temp_pdfs")
os.makedirs(TEMP_DIR, exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(TEMP_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        result = rag_utils.process_pdf(file_path)
        return {"message": result}
    except Exception as e:
        logger.error(f"Error in /upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@app.post("/ask")
async def ask_question(data: dict):
    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    
    try:
        answer = rag_utils.get_answer(question)
        return {"answer": answer}
    except Exception as e:
        logger.error(f"Error in /ask: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def root():
    return {"message": "RAG PDF Assistant API is running"}
