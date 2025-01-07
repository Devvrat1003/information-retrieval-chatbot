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

@app.get("/askLLM/{question}")
async def getLLMResponse(question:str):
    messages = [
        HumanMessage("You are a helpful intermediary chatbot for a hotel website. You have to answer question based on their query. Feel free to ask question to user if there is any doubt."),
        # HumanMessage(question),
    ]
    result = executeQuery.run(question)
    query = executeQuery.write_query({"question":question})["query"]
    queryRes = executeQuery.execute_query({"query":query})
    responseToUser = executeQuery.generate_answer({"question":question, "query": query, "result": queryRes})

    model.invoke(messages)
        
    # print(query, "query") 
    # print(responseToUser)
    # print(result, "result")

    return {"result": result[2]}
    return responseToUser