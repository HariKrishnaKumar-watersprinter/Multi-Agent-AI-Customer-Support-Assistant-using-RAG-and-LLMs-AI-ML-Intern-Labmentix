import sys
import pathlib
sys.path.append(str(pathlib.Path(__file__).resolve().parent))
from vectorstore.pinecone_vectorstore import pinecone_ingest

def retrieve_context(query: str) -> str:

    retriever = pinecone_ingest()
    docs = retriever.invoke(query)
    return "\n".join([doc.page_content for doc in docs])