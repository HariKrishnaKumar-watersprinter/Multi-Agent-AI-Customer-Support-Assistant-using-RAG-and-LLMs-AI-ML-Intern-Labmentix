from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader
import pathlib 

def get_embeddings():
    print("Loading PDF documents...")
    # Changed to PyPDFLoader to read .pdf files
    BASE_DIR = pathlib.Path(__file__).resolve().parent.parent.parent.parent
    KB_DIR = BASE_DIR / "knowledge_base"
    if not KB_DIR.exists():
        raise FileNotFoundError(
            f"Knowledge base directory not found at: {KB_DIR}\n"
            f"Please ensure the 'knowledge_base' folder exists in your project root."
        )

    print(f"Loading PDF documents from {KB_DIR}...")
    loader = DirectoryLoader(str(KB_DIR), glob="**/*.pdf", loader_cls=PyPDFLoader)
    docs = loader.load()
    if len(docs) == 0:
        print("Warning: No PDF documents were loaded. Check if the folder contains PDFs.")
    print(f"Loaded {len(docs)} document pages. Splitting...")
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = text_splitter.split_documents(docs)
    print("Initializing HuggingFace embeddings...")
    embeddings= HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    return embeddings, chunks