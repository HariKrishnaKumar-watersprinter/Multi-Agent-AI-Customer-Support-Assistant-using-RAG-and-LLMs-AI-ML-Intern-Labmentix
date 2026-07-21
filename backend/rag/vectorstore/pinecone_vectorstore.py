import sys
import pathlib 
sys.path.append(str(pathlib.Path(__file__).resolve().parent.parent))
from embeddings.embedder import get_embeddings
import os
from langchain_pinecone import PineconeVectorStore
from pinecone import Pinecone, ServerlessSpec

def pinecone_ingest():
    embeddings, chunks = get_embeddings()
    api_key = os.environ.get("PINECONE_API_KEY")
    cloud = os.environ.get('PINECONE_CLOUD') 
    region = os.environ.get('PINECONE_REGION')
    spec = ServerlessSpec(cloud=cloud, region=region)
    pc = Pinecone(api_key=api_key)
    index_name = 'multiagent'
    
    # Get existing indexes
    existing_indexes = [idx.name for idx in pc.list_indexes()]
    
    if index_name not in existing_indexes:
        # if does not exist, create index
        pc.create_index(
            name=index_name,
            dimension=384,  # dimensionality of miniLM (384)
            metric='cosine',
            spec=spec
        )
        print(f"Created new Pinecone index: {index_name}")
    
    # connect to index
    index = pc.Index(index_name)
    
    # Check how many vectors are already in the index
    stats = index.describe_index_stats()
    vector_count = stats.get('total_vector_count', 0)

    # Only ingest if the index is empty
    if vector_count > 0:
        docsearch = PineconeVectorStore.from_existing_index(
            index_name=index_name, 
            embedding=embeddings
        )
        print(f"Index exists and has {vector_count} vectors. Returning retriever.")
    else:
        docsearch = PineconeVectorStore.from_documents(
            chunks, 
            embeddings, 
            index_name=index_name
        )
        print('Ingested to Pinecone')
    
    # Return the retriever
    return docsearch.as_retriever(search_kwargs={"k": 3})
