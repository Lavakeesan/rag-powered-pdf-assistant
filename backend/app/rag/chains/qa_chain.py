import os
import logging
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import config

logger = logging.getLogger(__name__)

def get_llm():
    """Initializes and returns the Google Gemini Chat model (gemini-1.5-flash)."""
    api_key = config.GEMINI_API_KEY or config.GOOGLE_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logger.error("Neither GEMINI_API_KEY nor GOOGLE_API_KEY is configured in backend/.env")
        raise ValueError("Google GenAI API Key is missing. Please set GEMINI_API_KEY in backend/.env")
        
    return ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        google_api_key=api_key
    )

def generate_answer(context: str, question: str) -> str:
    """Generates an answer using the Gemini Chat model with provided context."""
    llm = get_llm()
    
    prompt = f"""You are a helpful assistant. Use the provided context to answer the user's question accurately.
    If the answer is not in the context, say that you don't have enough information.
    
    Context:
    {context}
    
    Question: {question}
    
    Answer:"""
    
    response = llm.invoke(prompt)
    
    if isinstance(response, str):
        return response
    if hasattr(response, "content"):
        return response.content
    return str(response)
