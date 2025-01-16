from fastapi import FastAPI
import getpass
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.middleware.cors import CORSMiddleware
import executeQuery
from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph
from pydantic import BaseModel
from fastapi import Request
import chatbot
# from langchain_mistralai import ChatMistralAI

# Load environment variables from .env

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost/",
    "http://127.0.0.1:8000/askLLM",
    "http://127.0.0.1:8000",
    "https://information-retriever-chatbot.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.environ.get("GROQ_API_KEY"):
    os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")
# if not os.environ.get("MISTRAL_API_KEY"):
#   os.environ["MISTRAL_API_KEY"] = getpass.getpass("Enter API key for Mistral AI: ")

# model = ChatMistralAI(model="mistral-large-latest")
# model = ChatGroq(model="llama-3.2-90b-vision-preview")
model = ChatGroq(model="llama3-70b-8192")
# model = ChatGroq(model="llama-3.3-70b-versatile")


@app.get("/")
async def root():
    return {"message": "Hello World"}

# with open("optimizedPrompt", "r") as f:   
with open("singleHotelPrompt", "r") as f:
    messages = []
    prompt = f.read()

class Item(BaseModel):
    messages: list
    question: str

@app.post("/askLLM/")
async def getLLMResponse(request: Request):
    data = await request.json()

    if len(data["messages"]) == 1:
        data["messages"] = []
        data["messages"].append(HumanMessage(prompt))
        data["messages"].append(AIMessage("Hello, welcome to Swaroop Vilas Hotel"))

    response = chatbot.chatbot(data["question"], data["messages"])
    return response