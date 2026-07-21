from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import pathlib
import sys
sys.path.append(str(pathlib.Path(__file__)))
from api.auth_routes import router as auth_router
from api.chat_routes import router as chat_router
from api.email_routes import router as email_router

app = FastAPI(title="🤖TechMart Enterprise AI Support")

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")
# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register modular routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(email_router)
@app.get("/health")
def health_check():
    return {"status": "Multi-Agent System is Online"}