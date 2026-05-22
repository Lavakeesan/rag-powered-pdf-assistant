import logging
from fastapi import APIRouter, HTTPException
from app.core import s3
from app.core.config import config
from app.core.dynamodb import dynamodb

router = APIRouter(prefix="", tags=["Stats"])

logger = logging.getLogger(__name__)

@router.get("/stats")
async def get_stats():
    """Return overall statistics for the dashboard.
    - total_pdfs: number of PDF documents stored in S3
    - total_questions: total number of chat questions across all users
    - total_responses: total number of AI responses (same as questions)
    """
    # Count PDFs in S3 bucket
    total_pdfs = 0
    if s3.s3_client and config.AWS_S3_BUCKET_NAME:
        try:
            paginator = s3.s3_client.get_paginator('list_objects_v2')
            for page in paginator.paginate(Bucket=config.AWS_S3_BUCKET_NAME):
                contents = page.get('Contents', [])
                total_pdfs += len(contents)
        except Exception as e:
            logger.error(f"Failed to list PDFs in S3: {e}")
            raise HTTPException(status_code=500, detail="Error counting PDFs")
    else:
        logger.warning("S3 client not configured; returning 0 PDFs")

    # Count chat messages in DynamoDB
    total_questions = 0
    if dynamodb:
        try:
            table = dynamodb.Table(config.DYNAMODB_CHAT_TABLE_NAME)
            # Scan the whole table (could be large; for demo purposes only)
            response = table.scan()
            items = response.get('Items', [])
            for item in items:
                # Legacy single question field
                if 'question' in item and 'answer' in item:
                    total_questions += 1
                # New messages array
                messages = item.get('messages', [])
                total_questions += len(messages)
        except Exception as e:
            logger.error(f"Failed to scan chat table: {e}")
            raise HTTPException(status_code=500, detail="Error counting chat messages")
    else:
        logger.warning("DynamoDB not initialized; returning 0 chat stats")

    return {
        "total_pdfs": total_pdfs,
        "total_questions": total_questions,
        "total_responses": total_questions,  # Assuming 1 response per question
    }
