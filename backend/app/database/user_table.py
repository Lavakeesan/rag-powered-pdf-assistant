import logging
from botocore.exceptions import ClientError
from app.core.config import config
from app.core.dynamodb import dynamodb

logger = logging.getLogger(__name__)

def get_table():
    if not dynamodb:
        raise Exception("DynamoDB has not been initialized. Check AWS credentials.")
    
    try:
        table = dynamodb.Table(config.DYNAMODB_TABLE_NAME)
        table.load()
        return table
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            logger.info(f"Table '{config.DYNAMODB_TABLE_NAME}' not found. Attempting to create it...")
            return create_users_table()
        else:
            raise e

def create_users_table():
    try:
        table = dynamodb.create_table(
            TableName=config.DYNAMODB_TABLE_NAME,
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()
        logger.info(f"Table '{config.DYNAMODB_TABLE_NAME}' created successfully.")
        return table
    except Exception as e:
        logger.error(f"Failed to create DynamoDB Table: {str(e)}")
        raise e

def get_user(email: str) -> dict:
    table = get_table()
    response = table.get_item(Key={'email': email})
    return response.get('Item')

def save_user(user_item: dict):
    table = get_table()
    table.put_item(Item=user_item)
