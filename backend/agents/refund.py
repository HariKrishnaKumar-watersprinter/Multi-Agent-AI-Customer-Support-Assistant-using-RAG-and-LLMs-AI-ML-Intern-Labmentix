from langchain_community.chat_models import ChatZhipuAI
from langchain_core.prompts import ChatPromptTemplate
import os

api_key2 = os.environ.get("api_key2")
llm = ChatZhipuAI(api_key=api_key2, model='GLM-4.5-Flash')
prompt = ChatPromptTemplate.from_template(
    "You are a refund Agent for TechMart Electronics. Answer strictly using the context and provide resutlt in well structure manner.\n"
    "CRITICAL RULE: Detect the language of the customer query. You MUST reply in the exact same language.\n"
    'Make answer in bullet points, each bullet point in the seperate line and do not use bullet for headings, follow strictly\n'
    "CONTEXT:\n{context}\n\nQUERY: {query}\n\nANSWER:"
    
)

def handle(query: str, context: str) -> str:
    chain = prompt | llm
    return chain.invoke({"context": context, "query": query}).content