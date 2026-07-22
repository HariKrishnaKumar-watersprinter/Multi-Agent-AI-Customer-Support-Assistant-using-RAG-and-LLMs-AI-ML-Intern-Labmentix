from database.mongodb import db
from datetime import datetime

def create_ticket(session_id: str, query: str, agents_used: list):
    if "complaint" in agents_used or "human_agent" in agents_used:
        ticket = {
            "ticket_id": f"TKT-{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "session_id": session_id,
            "query": query,
            "status": "open",
            "created_at": datetime.now()
        }
        db.tickets.insert_one(ticket)
        return ticket["ticket_id"]
    return None