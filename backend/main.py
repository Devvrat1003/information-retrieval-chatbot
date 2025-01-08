from fastapi import FastAPI, Request
import getpass
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, AIMessage
from fastapi.middleware.cors import CORSMiddleware
import executeQuery
from dotenv import load_dotenv
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import START, MessagesState, StateGraph

import chatbot


# Load environment variables from .env
load_dotenv()

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://information-retriever-chatbot.netlify.app"
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

model = ChatGroq(model="llama3-8b-8192")


@app.get("/")
async def root():
    return {"message": "Hello World"}

with open("optimizedPrompt", "r") as f:
    messages = []
    prompt = f.read()

@app.get("/askLLM/{question}")
async def getLLMResponse(question: str, messages: list) -> dict:
    if len(messages) == 0:
        messages.append(HumanMessage(prompt))

    response = chatbot.chatbot(question, messages)

    return {"messages": messages, "response": response}