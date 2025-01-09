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
# from fastapi import Request
import chatbot

# Load environment variables from .env
# load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:5173/",
    "http://localhost/",
    "https://information-retriever-chatbot.netlify.app",
    "https://information-retriever-chatbot.netlify.app/"
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

model = ChatGroq(model="llama3-70b-8192")

@app.get("/")
async def root():
    return {"message": "Hello World"}

with open("optimizedPrompt", "r") as f:
    messages = []
    prompt = f.read()

class Item(BaseModel):
    messages: list
    question: str

@app.post("/askLLM/")
async def getLLMResponse(data: Item):

    if len(data.messages) == 0:
        data.messages.append(HumanMessage(prompt))

    response = chatbot.chatbot(data.question, data.messages)
    # print(data.messages)
    return response