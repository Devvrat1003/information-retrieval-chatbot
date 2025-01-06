from fastapi import FastAPI, Request
import getpass
import os
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:5173/",
    "http://localhost:5173",
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

@app.get("/askLLM/{question}")
async def getLLMResponse(question:str):
    messages = [
        SystemMessage("Act as an information retrieval chatbot. I'll ask you questions, and you'll respond with relevant information from your knowledge base. Go ahead and initialize your knowledge graph. You can provide answers in a conversational tone. Ready when you are!\"\n\n**Example Questions:**\n\n* What is the capital of France?\n* Who is the CEO of Google?\n* What is the definition of artificial intelligence?\n* Can you explain the concept of quantum computing?\n* What is the latest update on the COVID-19 pandemic?\n* Can you provide a list of top 5 universities in the world for computer science?\n\n**Note:** You can add or modify the questions to test the chatbot's abilities. Also, you can provide additional training data or fine-tune the model to improve its performance.You can ask question if something is not clear to you."),
        HumanMessage(question),
    ]

    ans = model.invoke(messages).content

    return ans