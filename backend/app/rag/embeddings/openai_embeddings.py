import os
import logging
from langchain_openai import OpenAIEmbeddings
from app.core.config import config

logger = logging.getLogger(__name__)

def get_embeddings():
    """Initializes and returns OpenAI Embeddings."""
    openai_key = config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info("Initializing OpenAI Embeddings model ('text-embedding-3-small').")
        return OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=openai_key
        )
        
    logger.error("No valid OPENAI_API_KEY found in backend/.env")
    raise ValueError("Missing API key. Please configure OPENAI_API_KEY in backend/.env")
