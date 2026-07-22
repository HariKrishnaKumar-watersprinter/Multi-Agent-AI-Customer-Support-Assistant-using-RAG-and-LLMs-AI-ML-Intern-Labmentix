from fastapi import APIRouter, Depends, HTTPException,UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from jose import JWTError, jwt
import os
from dotenv import load_dotenv
from database.mongodb import save_message, get_history, get_chat,db
from agents.router import route_and_process
from agents.summary import generate_summary
import datetime
import shutil, os
from email.message import EmailMessage
from api.email_routes import send_email_reply

load_dotenv()
router = APIRouter(prefix="/chat", tags=["Chat"])
security = HTTPBearer()
SECRET_KEY = os.getenv("JWT_SECRET")

class ChatBody(BaseModel):
    message: str
    session_id: str

class FeedbackRequest(BaseModel):
    session_id: str
    rating: str

class EmailSummaryRequest(BaseModel):
    session_id: str

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=["HS256"])
        username = payload.get("sub")
        email = payload.get("email", "") 
        if not username:
            raise HTTPException(status_code=401, detail="Invalid token")
        return {"username": username, "email": email}
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")


# FIX: Changed current_user type to dict, extract username string for DB
@router.post("/send")
def send_message(body: ChatBody, current_user: dict = Depends(get_current_user)):
    save_message(body.session_id, "user", body.message)
    ai_response, agents_used = route_and_process(body.message)
    save_message(body.session_id, "ai", ai_response, agents_used=agents_used)
    return {"response": ai_response, "agents_used": agents_used}

@router.get("/history/{user_id}")
def fetch_history(user_id: str, current_user: dict = Depends(get_current_user)):
    return get_history(user_id)

@router.get("/session/{session_id}")
def fetch_session(session_id: str, current_user: dict = Depends(get_current_user)):
    return get_chat(session_id)

@router.delete("/session/{session_id}")
def delete_session(session_id: str, current_user: dict = Depends(get_current_user)):
    db.conversations.delete_one({"session_id": session_id})
    return {"message": "Session deleted successfully"}

@router.delete("/history/{user_id}")
def clear_all_history(user_id: str, current_user: dict = Depends(get_current_user)):
    db.conversations.delete_many({"session_id": {"$regex": f"^{user_id}_"}})
    return {"message": "All history cleared successfully"}

@router.get("/summarize/{session_id}")
def summarize_session(session_id: str, current_user: dict = Depends(get_current_user)):
    messages = get_chat(session_id)
    if not messages: raise HTTPException(404, "No messages")
    summary = generate_summary(messages)
    return {"summary": summary}

# FIX: Extract the string safely from the dictionary
@router.post("/feedback")
def submit_feedback(request: FeedbackRequest, current_user: dict = Depends(get_current_user)):
    db.feedback.insert_one({
        "session_id": request.session_id,
        "user": current_user.get("username"), # Extract string!
        "rating": request.rating,
        "timestamp": datetime.datetime.now()
    })
    return {"message": "Feedback recorded"}

# FIX: Extract the string safely from the dictionary
@router.post("/admin/upload-kb")
def upload_kb(file: UploadFile = File(...), current_user: dict = Depends(get_current_user)):
    # FIX: Extract the username string from the dictionary
    username = current_user.get("username")
    
    # FIX: Check the extracted string
    if current_user.get("username") != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    
    if not file.filename.endswith('.pdf') and not file.filename.endswith('.txt'):
         raise HTTPException(status_code=400, detail="Only PDF or TXT files are allowed")
    
    try:
        # Save file to the knowledge_base folder
        file_path = f"../knowledge_base/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Re-trigger Pinecone Ingestion
        os.system("python rag/vectorstore/pinecone_vectorstore.py")
        
        return {"message": f"{file.filename} uploaded and RAG knowledge base updated successfully!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@router.get("/analytics")
def get_analytics(current_user: dict = Depends(get_current_user)):
    # 1. Extract the username from the dictionary
    username = current_user.get("username")
    
    if username != "admin":
        raise HTTPException(status_code=403, detail="Admin access only")
    # 2. Fetch data specific to THIS user
    total_chats = db.conversations.count_documents({"session_id": {"$regex": f"^{username}_"}})
    total_tickets = db.tickets.count_documents({"status": "open"})
    
    good_feedback = db.feedback.count_documents({"rating": "good"})
    bad_feedback = db.feedback.count_documents({"rating": "bad"})
    
    total_feedback = good_feedback + bad_feedback
    csat = f"{(good_feedback / total_feedback * 100):.1f}%" if total_feedback > 0 else "100%"
    
    return {
        "total_chats": total_chats,
        "open_tickets": total_tickets,
        "csat_score": csat,
        "good_feedback": good_feedback,
        "bad_feedback": bad_feedback
    }

@router.post("/email-summary")
def email_summary(request: EmailSummaryRequest, current_user: dict = Depends(get_current_user)):
    # FIX: Safely get email and username
    user_email = current_user.get("email")
    username = current_user.get("username", "User")
    
    if not user_email:
        raise HTTPException(status_code=400, detail="No email associated with this account")
        
    messages = get_chat(request.session_id)
    if not messages:
        raise HTTPException(status_code=404, detail="No messages found in this session")

    summary_text = generate_summary(messages)
    
    email_body = f"""Hi {username},

Here is the summary of your recent support conversation:

----------------------------------------
{summary_text}
----------------------------------------

Thank you for using TechMart AI Support!
"""
    
    # Wrap email sending in try/except to see the actual SMTP error
    try:
        send_email_reply(user_email, "Your TechMart Support Chat Summary", email_body)
        return {"message": f"Summary successfully sent to {user_email}"}
    except Exception as e:
        # This will print the actual error to your FastAPI terminal
        print(f"EMAIL ERROR: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")