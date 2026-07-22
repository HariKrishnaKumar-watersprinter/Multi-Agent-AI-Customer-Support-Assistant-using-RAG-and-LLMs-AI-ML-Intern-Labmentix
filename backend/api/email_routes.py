from fastapi import APIRouter, Request, HTTPException
from agents.router import route_and_process
import smtplib
from email.message import EmailMessage
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/webhook", tags=["Email"])

def send_email_reply(to_email: str, subject: str, body: str):
    """
    Helper function to send an email back to the customer using SMTP.
    """
    msg = EmailMessage()
    msg['From'] = os.getenv("SMTP_EMAIL")
    msg['To'] = to_email
    msg['Subject'] = f"Re: {subject} - TechMart Support"
    msg.set_content(body)

    try:
        # Using Gmail SMTP as an example. Use your App Password here.
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as smtp:
            smtp.login(os.getenv("SMTP_EMAIL"), os.getenv("SMTP_PASSWORD"))
            smtp.send_message(msg)
        print(f"Reply email successfully sent to {to_email}")
        return True
    except Exception as e:
        # This will print the EXACT error (e.g., wrong password, locked account, etc.)
        print(f"!!! DETAILED SMTP ERROR: {type(e).__name__} - {str(e)}")
        raise Exception(f"SMTP Error: {str(e)}") # Throw it so the frontend sees it

@router.post("/email")
async def email_webhook(request: Request):
    """
    Webhook hit by SendGrid/Mailgun when an email is received.
    """
    try:
        # 1. Parse JSON payload (Standard SendGrid/Mailgun format)
        payload = await request.json()
        
        # Adapt these keys based on your specific provider's JSON structure
        sender_email = payload.get("from") or payload.get("From")
        subject = payload.get("subject") or payload.get("Subject", "Customer Inquiry")
        email_body = payload.get("text") or payload.get("TextBody", "")
        
        if not email_body:
            raise HTTPException(status_code=400, detail="No email body found")

        print(f"Received email from {sender_email}: {subject}")

        # 2. Combine subject and body for better AI context
        full_query = f"Subject: {subject}\n\nEmail Body:\n{email_body}"
        
        # 3. Pass to your existing Multi-Agent System
        ai_response, agents_used = route_and_process(full_query)

        # 4. Format the email reply beautifully
        agent_str = ", ".join(agents_used).upper()
        email_reply = f"""Hi,

Thank you for contacting TechMart Support. 
Your query was analyzed by our {agent_str} Agent(s).

Here is the response:
---
{ai_response}
---

Best Regards,
TechMart Multi-Agent AI System
"""

        # 5. Send the email back to the customer
        send_email_reply(sender_email, subject, email_reply)

        return {"status": "success", "message": "Email processed and reply sent."}

    except Exception as e:
        print(f"Email Webhook Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process email: {str(e)}")