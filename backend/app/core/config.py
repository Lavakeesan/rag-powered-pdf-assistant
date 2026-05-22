import os
from dotenv import load_dotenv

# Load env variables
current_dir = os.path.dirname(os.path.abspath(__file__))
# Move up to the backend folder to find the .env file
env_path = os.path.join(current_dir, '..', '..', '.env')
load_dotenv(env_path)

class Config:
    # AWS Credentials
    AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
    DYNAMODB_TABLE_NAME = os.getenv("DYNAMODB_TABLE_NAME", "AskMyPDFUsers")
    DYNAMODB_CHAT_TABLE_NAME = os.getenv("DYNAMODB_CHAT_TABLE_NAME", "AskMyPDFChatHistory")
    AWS_S3_BUCKET_NAME = os.getenv("AWS_S3_BUCKET_NAME", "askmypdf-workspace-bucket")

    # JWT Config
    JWT_SECRET = os.getenv("JWT_SECRET", "askmypdf-ethereal-secret-key-123456")
    JWT_ALGORITHM = "HS256"

    # Pinecone Config
    PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
    PINECONE_INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "rag-powered-pdf-assistant")

    # OpenAI Config
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

    # Google Client ID
    GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

config = Config()
