import os
import logging
from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from app.core.config import config

logger = logging.getLogger(__name__)

def get_llm():
    """Initializes and returns either OpenAI ChatOpenAI or ChatGoogleGenerativeAI Chat model depending on config."""
    # 1. Check for OpenAI API Key
    openai_key = config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info("Initializing OpenAI LLM model ('gpt-4o-mini').")
        return ChatOpenAI(
            model="gpt-4o-mini",
            openai_api_key=openai_key,
            temperature=0.7
        )
        
    # 2. Fallback to Gemini
    gemini_key = config.GEMINI_API_KEY or config.GOOGLE_API_KEY or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if gemini_key:
        logger.info("Initializing Google Gemini Chat model ('gemini-1.5-flash').")
        return ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=gemini_key
        )
        
    logger.error("No valid LLM credentials found in backend/.env (expected OPENAI_API_KEY or GEMINI_API_KEY)")
    raise ValueError("Missing API keys. Please configure OPENAI_API_KEY or GEMINI_API_KEY in backend/.env")

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
