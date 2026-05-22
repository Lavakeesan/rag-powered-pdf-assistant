import sys
import os
import logging
# Add parent directory to path so 'app' package can be discovered out of the box
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, pdf, chat

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="AskMyPDF AI - RAG PDF Assistant API", version="1.0.0")

# Enable CORS for frontend interaction
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router)
app.include_router(pdf.router)
app.include_router(chat.router)

@app.get("/")
async def root():
    return {"message": "AskMyPDF AI RAG PDF Assistant API is running"}
