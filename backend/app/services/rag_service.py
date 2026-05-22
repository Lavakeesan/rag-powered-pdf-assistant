import logging
from app.rag.loaders import pdf_loader
from app.rag.chunking import text_splitter
from app.rag.embeddings import openai_embeddings
from app.rag.vectorstore import pinecone_store
from app.rag.retrievers import retriever
from app.rag.chains import qa_chain

logger = logging.getLogger(__name__)

def process_pdf(file_path: str) -> str:
    """Orchestrates loading, splitting, embedding, and storing a PDF file into Pinecone."""
    try:
        logger.info(f"Processing PDF in modular service: {file_path}")
        
        # 1. Load PDF
        documents = pdf_loader.load_pdf(file_path)
        
        # 2. Split documents into chunks
        chunks = text_splitter.split_documents(documents)
        
        # 3. Get OpenAI Embeddings model
        embeddings = openai_embeddings.get_embeddings()
        
        # 4. Save to Pinecone
        result = pinecone_store.index_documents(chunks, embeddings, file_path)
        return result
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise e

def get_answer(question: str, filename: str = None) -> str:
    """Orchestrates context retrieval and prompt generation for user Q&A."""
    try:
        logger.info(f"Getting answer in modular service: {question} for file: {filename}")
        
        # 1. Retrieve context
        context = retriever.retrieve_context(question, filename=filename)
        
        # 2. Generate answer using QA chain
        answer = qa_chain.generate_answer(context, question)
        return answer
    except Exception as e:
        logger.error(f"Error getting answer: {str(e)}")
        raise e
