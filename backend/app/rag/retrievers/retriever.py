from app.rag.embeddings import openai_embeddings
from app.rag.vectorstore import pinecone_store

def retrieve_context(query: str, k: int = 10, filename: str = None) -> str:
    """Retrieves relevant document contexts from Pinecone for a given query."""
    embeddings_model = openai_embeddings.get_embeddings()
    matches = pinecone_store.similarity_search(query, embeddings_model, k=k, source_file=filename)
    return "\n".join(matches)
