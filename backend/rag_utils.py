import os
import logging
import re
import uuid
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import ChatOpenAI
from langchain_openai import OpenAIEmbeddings
from pinecone import Pinecone

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load .env from the same directory as this file
# Using absolute path to ensure it's found
current_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(current_dir, '.env')
load_dotenv(env_path)

# Initialize API Keys
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Basic validation
if not PINECONE_API_KEY:
    logger.error("PINECONE_API_KEY not found")
if not OPENAI_API_KEY:
    logger.error("OPENAI_API_KEY not found")

# Set environment variables for LangChain integrations
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY or ""

def sanitize_filename(filename):
    # Remove non-ASCII characters to satisfy Pinecone ID requirements
    return re.sub(r'[^\x00-\x7F]+', '', filename)

def process_pdf(file_path: str):
    try:
        logger.info(f"Processing PDF: {file_path}")
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        texts = text_splitter.split_documents(documents)
        
        embeddings_model = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=OPENAI_API_KEY
        )
        
        # Initialize Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(INDEX_NAME)
        
        logger.info(f"Upserting to Pinecone index: {INDEX_NAME} (1536 dims)")
        
        base_name = sanitize_filename(os.path.basename(file_path))
        # Add a unique suffix to the file ID to prevent collisions
        file_id = f"{base_name}_{uuid.uuid4().hex[:8]}"
        
        vectors = []
        for i, t in enumerate(texts):
            embedding = embeddings_model.embed_query(t.page_content)
            vectors.append({
                "id": f"vec_{i}_{file_id}",
                "values": embedding,
                "metadata": {"text": t.page_content}
            })
            
            # Batch upsert every 100 vectors
            if len(vectors) >= 100:
                index.upsert(vectors=vectors)
                vectors = []
        
        if vectors:
            index.upsert(vectors=vectors)
            
        return "PDF processed and indexed successfully."
    except Exception as e:
        logger.error(f"Error processing PDF: {str(e)}")
        raise e

def get_answer(question: str):
    try:
        logger.info(f"Getting answer for: {question}")
        
        embeddings_model = OpenAIEmbeddings(
            model="text-embedding-3-small",
            openai_api_key=OPENAI_API_KEY
        )
        
        # 1. Embed query
        query_vector = embeddings_model.embed_query(question)
        
        # 2. Query Pinecone
        pc = Pinecone(api_key=PINECONE_API_KEY)
        index = pc.Index(INDEX_NAME)
        results = index.query(vector=query_vector, top_k=5, include_metadata=True)
        
        # 3. Build context
        context = "\n".join([res.metadata['text'] for res in results.matches if 'text' in res.metadata])
        
        # 4. Generate answer with OpenAI Chat model
        llm = ChatOpenAI(
            model="gpt-3.5-turbo"
        )
        
        prompt = f"""You are a helpful assistant. Use the provided context to answer the user's question accurately.
        If the answer is not in the context, say that you don't have enough information.
        
        Context:
        {context}
        
        Question: {question}
        
        Answer:"""
        
        response = llm.invoke(prompt)
        # Ensure a plain string is returned to the frontend
        if isinstance(response, str):
            return response
        if hasattr(response, "content"):
            return response.content
        return str(response)
    except Exception as e:
        logger.error(f"Error getting answer: {str(e)}")
        raise e
