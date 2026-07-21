from langchain_community.chat_models import ChatZhipuAI
from langchain_core.prompts import ChatPromptTemplate
import os

api_key2 = os.environ.get("api_key2")
llm = ChatZhipuAI(api_key=api_key2, model='GLM-4.5-Flash')
prompt = ChatPromptTemplate.from_template(
    """Role: You are a Senior Technical Support Agent.
Task: Read the conversation below and write a concise technical summary (max 4 sentences) describing:
1. The specific technical issue the user faced.
2. The troubleshooting steps taken.
3. The final resolution or current status.

Conversation:\n{messages}"""
)

def generate_summary(messages: list) -> str:
    # Convert messages to simple text string
    text = "\n".join([f"{m['role']}: {m['content']}" for m in messages])
    chain = prompt | llm
    return chain.invoke({"messages": text}).content