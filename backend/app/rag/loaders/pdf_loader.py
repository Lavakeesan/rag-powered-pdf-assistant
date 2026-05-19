from langchain_community.document_loaders import PyPDFLoader
from typing import List
from langchain_core.documents import Document

def load_pdf(file_path: str) -> List[Document]:
    """Reads a PDF file from a given path and returns parsed LangChain document objects."""
    loader = PyPDFLoader(file_path)
    return loader.load()
