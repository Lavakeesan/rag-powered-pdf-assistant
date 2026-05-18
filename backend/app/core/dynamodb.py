import boto3
import logging
from app.core.config import config

logger = logging.getLogger(__name__)

dynamodb = None

try:
    if config.AWS_ACCESS_KEY_ID and config.AWS_SECRET_ACCESS_KEY:
        dynamodb = boto3.resource(
            'dynamodb',
            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
            region_name=config.AWS_REGION
        )
        logger.info("DynamoDB resource initialized with provided AWS keys.")
    else:
        # Fallback to AWS credential chain
        dynamodb = boto3.resource('dynamodb', region_name=config.AWS_REGION)
        logger.info("DynamoDB resource initialized with AWS credential chain.")
except Exception as e:
    logger.error(f"Failed to initialize AWS DynamoDB resource: {str(e)}")
