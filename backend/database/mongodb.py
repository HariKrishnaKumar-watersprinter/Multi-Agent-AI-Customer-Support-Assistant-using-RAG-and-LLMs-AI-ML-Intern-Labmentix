from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from fastapi.responses import JSONResponse
from pymongo import AsyncMongoClient
load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client["techmart_support"]

def save_message(session_id: str, role: str, content: str, agents_used: list = None):
    db.conversations.update_one(
        {"session_id": session_id},
        {
            "$push": {"messages": {"role": role, "content": content, "agents": agents_used, "timestamp": str(datetime.now())}},
            "$setOnInsert": {"created_at": str(datetime.now())}
        },
        upsert=True
    )

def get_history(user_id: str):
    sessions = db.conversations.find({"session_id": {"$regex": f"^{user_id}_"}}).sort("created_at", -1)
    return [{"session_id": s["session_id"], "preview": s["messages"][0]["content"][:50]} for s in sessions if s.get("messages")]

def get_chat(session_id: str):
    session = db.conversations.find_one({"session_id": session_id})
    return session["messages"] if session else []