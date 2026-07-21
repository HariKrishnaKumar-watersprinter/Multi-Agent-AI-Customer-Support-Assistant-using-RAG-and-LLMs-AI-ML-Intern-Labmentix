from langchain_community.chat_models import ChatZhipuAI
from langchain_core.prompts import ChatPromptTemplate
import os

api_key2 = os.environ.get("api_key2")
llm = ChatZhipuAI(api_key=api_key2, model='GLM-4.5-Flash')
prompt = ChatPromptTemplate.from_template(
    "Analyze the sentiment of this customer message. Reply ONLY with one word: 'angry', 'frustrated', 'neutral', or 'happy'.\n"
    "Message: {query}"
)
def handle(query: str) -> str:
    chain = prompt | llm
    try:
        result = chain.invoke({"query": query}).content.strip().lower()
        return result if result in ["angry", "frustrated", "neutral", "happy"] else "neutral"
    except:
        return "neutral"