import os
import logging
from langchain_openai import ChatOpenAI
from app.core.config import config

logger = logging.getLogger(__name__)

def get_llm():
    """Initializes and returns OpenAI Chat model depending on config."""
    openai_key = config.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY")
    if openai_key:
        logger.info("Initializing OpenAI LLM model ('gpt-4o-mini').")
        return ChatOpenAI(
            model="gpt-4o-mini",
            openai_api_key=openai_key,
            temperature=0.0
        )
        
    logger.error("No valid OPENAI_API_KEY found in backend/.env")
    raise ValueError("Missing API key. Please configure OPENAI_API_KEY in backend/.env")

def generate_answer(context: str, question: str) -> str:
    """Generates an answer using the OpenAI Chat model with provided context."""
    llm = get_llm()
    
    prompt = f"""You are a smart, analytical assistant. Answer the user's question accurately using ONLY the provided context.
    If the context contains relevant information that implies the answer, synthesize it clearly.
    If the context does not contain enough information to answer the question, state that clearly instead of guessing.
    
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
