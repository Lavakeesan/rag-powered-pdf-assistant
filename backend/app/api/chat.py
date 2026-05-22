from fastapi import APIRouter, HTTPException
from app.services import rag_service
from app.database import chat_table

router = APIRouter(prefix="", tags=["Chat"])

@router.post("/ask")
async def ask_question(data: dict):
    question = data.get("question")
    filename = data.get("filename")
    email = data.get("email")
    chat_id = data.get("chat_id")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    
    try:
        answer = rag_service.get_answer(question, filename)
        saved_chat_id = None
        if email:
            saved_chat = chat_table.save_chat(email, filename, question, answer, chat_id)
            saved_chat_id = saved_chat.get("chat_id")
        return {"answer": answer, "chat_id": saved_chat_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/history")
async def get_history(email: str = None):
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")
    try:
        chats = chat_table.get_user_chats(email)
        return {"chats": chats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
