from fastapi import APIRouter, HTTPException
from app.services import rag_service

router = APIRouter(prefix="", tags=["Chat"])

@router.post("/ask")
async def ask_question(data: dict):
    question = data.get("question")
    if not question:
        raise HTTPException(status_code=400, detail="Question is required")
    
    try:
        answer = rag_service.get_answer(question)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
