from app.rag.embeddings import gemini_embeddings
from app.rag.vectorstore import pinecone_store

def retrieve_context(query: str, k: int = 5) -> str:
    """Retrieves relevant document contexts from Pinecone for a given query."""
    embeddings_model = gemini_embeddings.get_embeddings()
    matches = pinecone_store.similarity_search(query, embeddings_model, k=k)
    return "\n".join(matches)
