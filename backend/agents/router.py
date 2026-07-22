import json
from langchain_core.prompts import ChatPromptTemplate
from rag.retriever import retrieve_context
from langchain_community.chat_models import ChatZhipuAI
from langchain_core.prompts import ChatPromptTemplate
import os
# Import specialized agents
from agents.billing import handle as billing_handle
from agents.technical import handle as technical_handle
from agents.product import handle as product_handle
from agents.complaint import handle as complaint_handle
from agents.faq import handle as faq_handle
from agents.refund import handle as refund_handle
from agents.shipping import handle as shipping_handle
from agents.warranty import handle as warranty_handle
from agents.usermanual import handle as usermanual_handle
from agents.installation import handle as installation_handle
from agents.sentiment import handle as analyze_sentiment
from agents.ticket import create_ticket
import uuid 

api_key2 = os.environ.get("api_key2")
llm = ChatZhipuAI(api_key=api_key2, model='GLM-4.5-Flash')

INTENT_PROMPT = ChatPromptTemplate.from_template(
    "Analyze the customer query and generate answer from correct agent then return ONLY a JSON array of relevant agent keys.\n"
    "Keys: 'billing', 'technical', 'product', 'complaint', 'faq','refund','shipping','warranty','usermanual','installation'.\n"
    "Query: {query}\n"
    #"Example: [\"billing\", \"technical\"]"
)

AGENT_MAP = {
    "billing": billing_handle,
    "technical": technical_handle,
    "product": product_handle,
    "complaint": complaint_handle,
    "faq": faq_handle,
    "refund": refund_handle,
    "shipping": shipping_handle,
    "warranty": warranty_handle,
    "usermanual": usermanual_handle,
    "installation": installation_handle,
}

def detect_intent(query: str) -> list:
    chain = INTENT_PROMPT | llm
    try:
        response = chain.invoke({"query": query}).content
        response = response.replace("```json", "").replace("```", "").strip()
        return json.loads(response)
    except:
        return ["faq"]
def generate_session_id() -> str:
    return str(uuid.uuid4())
def route_and_process(query: str) -> tuple:
    # 1. Check Sentiment First!
    sentiment = analyze_sentiment(query)
    
    if sentiment in ["angry", "frustrated"]:
        return "⚠️ I sense you are frustrated. I am immediately escalating this to a senior human agent. Please hold.", ["human_agent"]
    
    active_agents = detect_intent(query)
    context = retrieve_context(query)
    
    responses = []
    for agent_name in active_agents:
        agent_function = AGENT_MAP.get(agent_name)
        if agent_function:
            agent_response = agent_function(query, context)
            responses.append(f"--- {agent_name.upper()} AGENT ---\n{agent_response}")
            
    final_response = "\n\n".join(responses)
    
    ticket_id = create_ticket(session_id=generate_session_id(), query=query, agents_used=active_agents)
    
    if ticket_id:
        final_response += f"\n\n🎫 **Ticket Created:** {ticket_id}"
        
    return final_response, active_agents