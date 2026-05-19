import os
import logging
from langchain_openai import OpenAIEmbeddings
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.core.config import config

logger = logging.getLogger(__name__)

def get_embeddings():
    """Initializes and returns either OpenAI or Google Gemini Embeddings depending on env config."""
    # 1. Check for OpenAI API Key
    openai_key = config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info("Initializing OpenAI Embeddings model ('text-embedding-3-small').")
        return OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=openai_key
        )
        
    # 2. Fallback to Gemini
    gemini_key = config.GEMINI_API_KEY or config.GOOGLE_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        logger.info("Initializing Google Gemini Embeddings model ('models/embedding-001').")
        return GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=gemini_key
        )
        
    logger.error("No valid LLM credentials found in backend/.env (expected OPENAI_API_KEY or GEMINI_API_KEY)")
    raise ValueError("Missing API keys. Please configure OPENAI_API_KEY or GEMINI_API_KEY in backend/.env")
