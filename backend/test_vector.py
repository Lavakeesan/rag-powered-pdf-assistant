import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vector = embeddings.embed_query("Hello world")

print(f"Vector Length: {len(vector)}")
print(f"First 10 numbers: {vector[:10]}")
