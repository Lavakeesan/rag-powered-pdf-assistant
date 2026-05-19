import boto3
import logging
from botocore.exceptions import ClientError
from app.core.config import config

logger = logging.getLogger(__name__)

s3_client = None

try:
    if config.AWS_ACCESS_KEY_ID and config.AWS_SECRET_ACCESS_KEY:
        s3_client = boto3.client(
            's3',
            aws_access_key_id=config.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=config.AWS_SECRET_ACCESS_KEY,
            region_name=config.AWS_REGION
        )
        logger.info("S3 client initialized with provided AWS keys.")
    else:
        # Fallback to AWS credential chain
        s3_client = boto3.client('s3', region_name=config.AWS_REGION)
        logger.info("S3 client initialized with AWS credential chain.")
except Exception as e:
    logger.error(f"Failed to initialize AWS S3 client: {str(e)}")


def check_or_create_bucket(bucket_name: str) -> bool:
    if not s3_client:
        logger.error("S3 client is not initialized. Cannot verify/create bucket.")
        return False
    try:
        s3_client.head_bucket(Bucket=bucket_name)
        logger.info(f"S3 bucket '{bucket_name}' verified and exists.")
        return True
    except ClientError as e:
        error_code = e.response['Error']['Code']
        if error_code in ['404', 'NoSuchBucket']:
            logger.info(f"S3 bucket '{bucket_name}' not found. Attempting to create it...")
            try:
                if config.AWS_REGION == 'us-east-1':
                    s3_client.create_bucket(Bucket=bucket_name)
                else:
                    s3_client.create_bucket(
                        Bucket=bucket_name,
                        CreateBucketConfiguration={'LocationConstraint': config.AWS_REGION}
                    )
                logger.info(f"S3 bucket '{bucket_name}' created successfully in region '{config.AWS_REGION}'.")
                return True
            except Exception as create_err:
                logger.error(f"Failed to create S3 bucket '{bucket_name}': {str(create_err)}")
                return False
        else:
            logger.error(f"Failed to verify S3 bucket '{bucket_name}': {str(e)}")
            return False
