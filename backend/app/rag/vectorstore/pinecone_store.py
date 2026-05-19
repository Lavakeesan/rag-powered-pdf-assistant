import os
import uuid
import logging
from pinecone import Pinecone
from app.core.config import config

logger = logging.getLogger(__name__)

def get_index():
    """Initializes and returns the Pinecone Index resource."""
    if not config.PINECONE_API_KEY:
        raise ValueError("PINECONE_API_KEY is not configured in backend/.env")
    
    pc = Pinecone(api_key=config.PINECONE_API_KEY)
    return pc.Index(config.PINECONE_INDEX_NAME)

def sanitize_filename(filename: str) -> str:
    """Removes non-ASCII characters from the filename to meet Pinecone vector ID constraints."""
    import re
    return re.sub(r'[^\x00-\x7F]+', '', filename)

def index_documents(documents, embeddings_model, file_path: str) -> str:
    """Embeds LangChain documents and saves them to Pinecone in batches."""
    index = get_index()
    base_name = sanitize_filename(os.path.basename(file_path))
    file_id = f"{base_name}_{uuid.uuid4().hex[:8]}"
    
    vectors = []
    for i, doc in enumerate(documents):
        embedding = embeddings_model.embed_query(doc.page_content)
        vectors.append({
            "id": f"vec_{i}_{file_id}",
            "values": embedding,
            "metadata": {"text": doc.page_content}
        })
        
        if len(vectors) >= 100:
            index.upsert(vectors=vectors)
            vectors = []
            
    if vectors:
        index.upsert(vectors=vectors)
        
    return "PDF processed and indexed successfully."

def similarity_search(query: str, embeddings_model, k: int = 5):
    """Embeds a user query, performs a vector search in Pinecone, and returns matched texts."""
    index = get_index()
    query_vector = embeddings_model.embed_query(query)
    results = index.query(vector=query_vector, top_k=k, include_metadata=True)
    return [res.metadata['text'] for res in results.matches if 'text' in res.metadata]
