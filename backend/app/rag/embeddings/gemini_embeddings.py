import os
import logging
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.config import config

logger = logging.getLogger(__name__)

def get_embeddings():
    """Initializes and returns the Google Gemini GenAIEmbeddings model."""
    api_key = config.GEMINI_API_KEY or config.GOOGLE_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logger.error("Neither GEMINI_API_KEY nor GOOGLE_API_KEY is configured in backend/.env")
        raise ValueError("Google GenAI API Key is missing. Please set GEMINI_API_KEY in backend/.env")
        
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=api_key
    )
