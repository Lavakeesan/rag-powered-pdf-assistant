import logging
import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from app.core.config import config
from app.core.dynamodb import dynamodb

logger = logging.getLogger(__name__)

def get_chat_table():
    if not dynamodb:
        raise Exception("DynamoDB has not been initialized. Check AWS credentials.")
    
    try:
        table = dynamodb.Table(config.DYNAMODB_CHAT_TABLE_NAME)
        table.load()
        return table
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
            logger.info(f"Table '{config.DYNAMODB_CHAT_TABLE_NAME}' not found. Attempting to create it...")
            return create_chat_table()
        else:
            raise e

def create_chat_table():
    try:
        table = dynamodb.create_table(
            TableName=config.DYNAMODB_CHAT_TABLE_NAME,
            KeySchema=[
                {
                    'AttributeName': 'email',
                    'KeyType': 'HASH'
                },
                {
                    'AttributeName': 'chat_id',
                    'KeyType': 'RANGE'
                }
            ],
            AttributeDefinitions=[
                {
                    'AttributeName': 'email',
                    'AttributeType': 'S'
                },
                {
                    'AttributeName': 'chat_id',
                    'AttributeType': 'S'
                }
            ],
            ProvisionedThroughput={
                'ReadCapacityUnits': 5,
                'WriteCapacityUnits': 5
            }
        )
        table.wait_until_exists()
        logger.info(f"Table '{config.DYNAMODB_CHAT_TABLE_NAME}' created successfully.")
        return table
    except Exception as e:
        logger.error(f"Failed to create DynamoDB Chat Table: {str(e)}")
        raise e

def save_chat(email: str, filename: str, question: str, answer: str, chat_id: str = None):
    table = get_chat_table()
    timestamp = datetime.utcnow().isoformat()
    
    new_message = {
        'question': question,
        'answer': answer,
        'timestamp': timestamp
    }
    
    existing_item = None
    if chat_id:
        try:
            response = table.get_item(Key={'email': email, 'chat_id': chat_id})
            existing_item = response.get('Item')
        except Exception as e:
            logger.error(f"Error getting item for session {chat_id}: {str(e)}")
            existing_item = None

    if existing_item:
        # Existing session: append new message
        messages = existing_item.get('messages', [])
        # If legacy / empty messages list but single question/answer exist, migrate them
        if not messages:
            if 'question' in existing_item and 'answer' in existing_item:
                messages.append({
                    'question': existing_item['question'],
                    'answer': existing_item['answer'],
                    'timestamp': existing_item.get('timestamp', timestamp)
                })
        
        messages.append(new_message)
        existing_item['messages'] = messages
        existing_item['timestamp'] = timestamp
        # Update filename if a new one is provided and the old one was empty / default
        if filename and filename != "No Document":
            existing_item['filename'] = filename
        
        table.put_item(Item=existing_item)
        return existing_item
    else:
        # New session: generate new chat_id if not provided
        if not chat_id:
            chat_id = str(uuid.uuid4())
            
        item = {
            'email': email,
            'chat_id': chat_id,
            'filename': filename or "No Document",
            'question': question, # Serve as the thread title
            'answer': answer,     # Keep answer for legacy fallback
            'timestamp': timestamp,
            'messages': [new_message]
        }
        table.put_item(Item=item)
        return item

def get_user_chats(email: str) -> list:
    table = get_chat_table()
    response = table.query(
        KeyConditionExpression="email = :email",
        ExpressionAttributeValues={
            ":email": email
        },
        ScanIndexForward=False # Return newest first
    )
    return response.get('Items', [])
