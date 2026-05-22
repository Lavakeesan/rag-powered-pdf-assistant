import os
import shutil
import logging
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.services import rag_service
from app.core import s3
from app.core.config import config

logger = logging.getLogger(__name__)

router = APIRouter(prefix="", tags=["PDFs"])

TEMP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "uploads")
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    email: str = Form(None),
    userId: str = Form(None)
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = os.path.join(TEMP_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # 1. Process local PDF via RAG (Pinecone & OpenAI chunks)
        result = rag_service.process_pdf(file_path)
        
        # 2. Upload file securely to AWS S3 bucket partitioned by user
        if s3.s3_client and config.AWS_S3_BUCKET_NAME:
            try:
                # Validate/Create S3 Bucket if it doesn't exist
                s3.check_or_create_bucket(config.AWS_S3_BUCKET_NAME)
                
                # Determine S3 Object Key prefix partition
                object_prefix = ""
                if email:
                    object_prefix = f"users/{email}/"
                elif userId:
                    object_prefix = f"users/{userId}/"
                
                s3_key = f"{object_prefix}{file.filename}"
                
                # Upload to S3
                s3.s3_client.upload_file(
                    file_path, 
                    config.AWS_S3_BUCKET_NAME, 
                    s3_key
                )
                logger.info(f"PDF Backup: successfully uploaded '{file.filename}' to S3 bucket '{config.AWS_S3_BUCKET_NAME}' under key '{s3_key}'.")
            except Exception as s3_err:
                logger.error(f"S3 Backup Failed for '{file.filename}': {str(s3_err)}")
                # We do not fail the whole request because local RAG was successful.
                # This guarantees that the system is fully fault-tolerant!
        
        return {"message": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)

@router.get("/documents")
async def list_documents(email: str = None):
    if not email:
        raise HTTPException(status_code=400, detail="Email query parameter is required")
        
    if not s3.s3_client or not config.AWS_S3_BUCKET_NAME:
        return []
        
    try:
        # Check/create the bucket first to ensure no errors
        s3.check_or_create_bucket(config.AWS_S3_BUCKET_NAME)
        
        prefix = f"users/{email}/"
        response = s3.s3_client.list_objects_v2(
            Bucket=config.AWS_S3_BUCKET_NAME,
            Prefix=prefix
        )
        
        documents = []
        if 'Contents' in response:
            for obj in response['Contents']:
                # The S3 key is like: users/email/filename.pdf
                # Let's extract the clean filename
                key = obj['Key']
                filename = key.replace(prefix, "")
                if not filename:
                    # Skip the folder prefix object itself if S3 lists it
                    continue
                    
                # Get clean size (in MB or KB)
                size_bytes = obj['Size']
                if size_bytes >= 1024 * 1024:
                    size_str = f"{size_bytes / (1024 * 1024):.2f} MB"
                else:
                    size_str = f"{size_bytes / 1024:.2f} KB"
                    
                # Format last modified date (e.g. "Oct 24, 2024")
                last_modified = obj['LastModified'].strftime("%b %d, %Y")
                
                documents.append({
                    "id": key,
                    "name": filename,
                    "date": last_modified,
                    "size": size_str,
                    "status": "processed",
                    "key": key
                })
                
        # Sort documents by date (S3 natural order or reverse order for newest first)
        return documents
    except Exception as e:
        logger.error(f"Failed to list documents in S3 for {email}: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/documents")
async def delete_document(key: str = None):
    if not key:
        raise HTTPException(status_code=400, detail="Document key is required")
        
    if not s3.s3_client or not config.AWS_S3_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="S3 client not initialized")
        
    try:
        s3.s3_client.delete_object(
            Bucket=config.AWS_S3_BUCKET_NAME,
            Key=key
        )
        logger.info(f"S3: successfully deleted object '{key}' from bucket '{config.AWS_S3_BUCKET_NAME}'.")
        return {"message": "Document deleted successfully"}
    except Exception as e:
        logger.error(f"Failed to delete document '{key}' from S3: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/documents/view")
async def view_document(key: str = None):
    if not key:
        raise HTTPException(status_code=400, detail="Document key is required")
        
    if not s3.s3_client or not config.AWS_S3_BUCKET_NAME:
        raise HTTPException(status_code=500, detail="S3 client not initialized")
        
    try:
        # Generate private pre-signed S3 URL that expires in 1 hour
        presigned_url = s3.s3_client.generate_presigned_url(
            'get_object',
            Params={
                'Bucket': config.AWS_S3_BUCKET_NAME,
                'Key': key,
                'ResponseContentType': 'application/pdf',
                'ResponseContentDisposition': 'inline'
            },
            ExpiresIn=3600
        )
        return {"url": presigned_url}
    except Exception as e:
        logger.error(f"Failed to generate S3 pre-signed URL for key '{key}': {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
