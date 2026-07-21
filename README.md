# 🤖 Multi-Agent AI Customer Support Assistant

![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109.2-009688?logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![LangChain](https://img.shields.io/badge/LangChain-0.1.9-1C3C5D?logo=langchain&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed_on_Vercel-000000?logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Backend_on_Render-4FC08D?logo=render&logoColor=white)

## 🌟 Project Overview

This project is an industry-level capstone application that simulates a modern enterprise customer support system. Unlike traditional single-model chatbots, this system utilizes a **Multi-Agent Architecture** powered by **Retrieval-Augmented Generation (RAG)** and **Large Language Models (LLMs)** to accurately answer customer queries across diverse domains such as billing, technical support, products, and complaints.

The system features a central **Orchestrator** that detects user intent, dynamically routes requests to specialized AI agents, retrieves context from a custom FAISS vector database, and generates accurate, context-aware responses while maintaining conversation history and user authentication.

---

## 🏗️ System Architecture

```text
Customer
  │
  ▼
Web Chat Interface (Next.js / React)
  │
  ▼
Backend API Server (FastAPI / Python)
  │
  ├──────────────────────┴───────────────────────┐
  ▼                                              ▼
Authentication & Session Memory               Intent Detection Agent
(JWT & MongoDB)                               (Classifies query domain)
  │                                              │
  │                                              ▼
  │                                        Agent Router (Orchestrator)
  │                                              │
  │                 ┌────────────┬─────────────┬──────────────┬──────────────┐
  │                 ▼            ▼             ▼              ▼              ▼
  │            Billing Agent Technical Agent Product Agent Complaint Agent FAQ Agent
  │                 │            │             │              │              │
  │                 └────────────┴─────────────┴──────────────┴──────────────┘
  │                                              │
  │                                              ▼
  │                                   Retrieval System (RAG Pipeline)
  │                                              │
  │                 ┌────────────────────────────┴────────────────────────────┐
  │                 ▼                                                         ▼
  │        HuggingFace Embeddings (MiniLM-L6-v2)               FAISS Vector Store
  │                 │                                                         │
  │                 └────────────────────────────┬────────────────────────────┘
  │                                              │
  │                                              ▼
  │                                   Company Knowledge Base (PDFs/TXTs)
  │                                              │
  ▼                                              ▼
Response Aggregator ◄────────────────────────────────────────────────────────────┘
  │
  ▼
Final Response to Customer + UI Update (Real-time streaming effects)
```

---

## ✨ Key Features (Base + Enhancements)

### Core Architecture (20/20)
* **Multi-Agent Routing:** Dynamic intent detection that triggers 1-to-N specialized agents (Billing, Technical, Product, Complaint, FAQ).
* **Advanced RAG Pipeline:** Chunking, vectorization using local HuggingFace embeddings, and semantic search using FAISS.
* **Conversation Memory:** Persistent session management stored securely in MongoDB Atlas.
* **Enterprise UI:** Dark editorial theme, animated message bubbles, collapsible sidebar, and mobile responsiveness.

### Advanced Enhancements (Bonus Points)
* 🌍 **Multilingual Support:** The AI automatically detects the user's language and replies in the same language (e.g., Spanish, French).
* 🎙️ **Voice-Enabled Support:** Integrated Web Speech API for hands-free dictation in the chat window.
* 😠 **Sentiment Analysis & Routing:** Detects frustrated/angry customers and automatically overrides the router to initiate a Human-Agent Handoff.
* 🎫 **Automatic Ticket Creation:** Complex issues or complaints automatically generate Ticket IDs saved to the database.
* 📧 **Email Summaries:** Users can request an AI-generated summary of their chat session to be sent directly to their registered email via SMTP.
* 📱 **Omnichannel Webhooks:** Built-in endpoints for WhatsApp (Twilio) and Email (SendGrid/SMTP) to process off-platform queries through the same AI brain.
* 🔄 **Error Regeneration:** "Regenerate response" button to retry failed LLM timeouts or bad outputs.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Axios, Framer Motion (CSS Animations) |
| **Backend** | Python 3.11+, FastAPI, Uvicorn, Pydantic |
| **AI & LLM** | LangChain, OpenAI API / ZhipuAI, HuggingFace `all-MiniLM-L6-v2` |
| **Vector DB** | FAISS (Local CPU) |
| **Database** | MongoDB Atlas (Cloud), Mongoose (PyMongo) |
| **Auth** | Python-JOSE (JWT), Passlib (Bcrypt) |
| **Deployment** | Vercel (Frontend), Render (Backend), GitHub Actions |

---

## 📁 Project Structure

```text
customer-support-ai/
│
├── frontend/                 # Next.js React Application
│   ├── app/                  # App router (page.tsx, layout.tsx, globals.css)
│   ├── components/           # Reusable UI components (MessageBubble, Sidebar, etc.)
│   ├── pages/                # Main page layouts (MainPage.tsx)
│   ├── hooks/                # Custom React hooks (useAuth.js, useChat.js)
│   ├── services/             # Axios API configuration (api.js)
│   ├── styles/               # Custom CSS (typewriter.css)
│   ├── package.json
│   └── .env.local           # NEXT_PUBLIC_API_URL
│
├── backend/                  # FastAPI Python Application
│   ├── api/                  # REST API routes
│   │   ├── auth_routes.py    # Login, Register, JWT logic
│   │   ├── chat_routes.py    # Chat history, analytics, email summary
│   │   ├── whatsapp_routes.py # Twilio webhook integration
│   │   └── email_routes.py   # SMTP inbound/outbound email logic
│   ├── agents/               # Multi-Agent System
│   │   ├── router.py         # Intent detection & Orchestrator
│   │   ├── billing.py        # Billing Agent persona
│   │   ├── technical.py      # Technical Agent persona
│   │   ├── product.py        # Product Agent persona
│   │   ├── complaint.py      # Complaint Agent persona
│   │   ├── faq.py            # FAQ Agent persona
│   │   ├── sentiment.py      # Sentiment analysis override
│   │   ├── summary.py        # AI conversation summarizer
│   │   └── ticket.py         # Auto-ticket generator
│   ├── rag/                  # Retrieval-Augmented Generation
│   │   ├── ingest.py         # Script to chunk docs and build FAISS
│   │   └── retriever.py      # Semantic search logic
│   ├── embeddings/           # HuggingFace embedder config
│   │   └── embedder.py
│   ├── vectorstore/          # FAISS DB connection
│   │   └── faiss_store.py
│   ├── database/             # MongoDB connection & queries
│   │   └── mongodb.py
│   ├── models/               # Pydantic schemas
│   │   └── schemas.py
│   ├── knowledge_base/       # Raw PDFs/TXTs for RAG
│   ├── faiss_index/          # Generated vector store (gitignored)
│   ├── main.py               # FastAPI app entry point
│   ├── start.sh              # Render deployment script
│   ├── requirements.txt
│   └── .env                  # API Keys, MongoDB URI, SMTP creds
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Setup & Installation

### Prerequisites
* Python 3.11+ installed
* Node.js 20+ installed
* MongoDB Atlas account (or local MongoDB)
* OpenAI API Key (or ZhipuAI)
* Gmail Account (for email summary feature)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/multiagent-ai-support.git
cd multiagent-ai-support
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
# source venv/bin/activate # Mac/Linux

pip install -r requirements.txt
```

### 3. Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```env
OPENAI_API_KEY=sk-proj-xxxx
OPENAI_API_BASE=https://api.openai.com/v1  # Change if using ZhipuAI
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=true
JWT_SECRET=your_super_secret_key
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_16_digit_app_password
```

### 4. Build the Knowledge Base (RAG)
1. Place your company PDFs or TXT files inside `backend/knowledge_base/`.
2. Run the ingestion script to chunk, embed, and store vectors in FAISS:
```bash
python rag/ingest.py
```

### 5. Start the Backend
```bash
uvicorn main:app --reload --port 8000
```
*(Visit `http://localhost:8000/docs` to see the interactive Swagger API docs).*

### 6. Frontend Setup
Open a new terminal:
```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend/` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 7. Start the Frontend
```bash
npm run dev
```
*(Visit `http://localhost:3000` to view the application).*

---

## 🧪 Demonstration Scenarios (For Evaluation)

To prove the Multi-Agent routing, try these exact prompts in the UI:

1. **Multi-Agent Trigger:** *"I paid yesterday but Premium is still locked."*
   * **Expected:** Triggers both `[BILLING]` and `[TECHNICAL]` agents. Retrieves context about sync delays.
2. **Sentiment/Handoff Trigger:** *"This is absolutely ridiculous, I want my money back right now or I am suing!"*
   * **Expected:** Detects anger, bypasses normal agents, returns a Human Agent Handoff message and generates a ticket ID.
3. **Multilingual Test:** *"Hola, ¿cuál es su política de reembolso?"*
   * **Expected:** Detects Spanish, replies entirely in Spanish using the FAQ agent.
4. **RAG Test:** *"What is the exact price of the X1 Earbuds?"*
   * **Expected:** Product Agent searches the knowledge base and returns "$129.99" accurately.
5. **Voice Test:** Click the microphone icon and speak a query.
6. **Email Summary:** Click the "Email Summary" button after a long chat to receive an AI-generated PDF summary in your registered email.

---

## ☁️ Cloud Deployment Strategy

This project is configured for modern cloud deployment:

1. **Frontend (Vercel):**
   * Root directory set to `frontend/`.
   * Environment variable `NEXT_PUBLIC_API_URL` set to the Render URL.
2. **Backend (Render):**
   * Build Command: `pip install -r requirements.txt`
   * Start Command: `bash start.sh`
   * *Crucial Note:* The `start.sh` script contains a conditional check (`if [ ! -d "faiss_index" ]`). Because Render uses an ephemeral filesystem, this script automatically rebuilds the FAISS vector database from raw PDFs on every deploy, guaranteeing persistence for the RAG pipeline.
3. **Database (MongoDB Atlas):**
   * Cloud-hosted NoSQL database allowing persistent authentication, chat history, and ticket storage across distributed instances.

---

## 👨‍💻 Future Scope
* Integration of live WebSocket connections for real-time agent typing indicators.
* Admin Dashboard UI to visually manage the Knowledge Base PDFs instead of API endpoints.
* Integration of LangSmith for deep tracing and observability of the Multi-Agent LangGraph execution paths.

---
*Developed as an Industry-Level Capstone Project focusing on scalable AI design, modern enterprise architecture, and cloud deployment practices.*
```
