from langchain_community.utilities import SQLDatabase
from typing_extensions import Annotated, TypedDict
from langchain_groq import ChatGroq
from langchain_community.tools.sql_database.tool import QuerySQLDatabaseTool
import getpass
import os
from dotenv import load_dotenv
import re
from langchain_core.messages import HumanMessage, AIMessage

load_dotenv()

# model = ChatGroq(model="llama-3.3-70b-versatile")
model = ChatGroq(model="llama3-70b-8192")

# creating application states
class State(TypedDict):
    question: str
    query: str
    result: str 
    answer: str

# # connecting to SQL database
db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

def execute_query(state: State):
    """Execute SQL query."""
    # if(validateQuery(state["query"])):
    execute_query_tool = QuerySQLDatabaseTool(db=db)
    return {"result": execute_query_tool.invoke(state["query"])}

def generate_answer(state:State, llm):
    """Answer question using retrieved information as context."""
    prompt = (
        "You are a helpful intermediary chatbot for a hotel website. You have to answer question based on their query. Feel free to ask question to user if there is any doubt. Given the following user question, corresponding SQL query, "
        "and SQL result, answer the user question, in a way human would answer. The user does not need to know what he asked, what was SQL query or if we are even using anything. Only generate the required answer.\n\n"
        f'Question: {state["question"]}\n'
        f'SQL Query: {state["query"]}\n'
        f'SQL Result: {state["result"]}'
    )
    response = llm.invoke(prompt)
    return {"answer": response.content}

def askDB(question: str, isSqlQuery: str, messages: list, model):

    result = execute_query({"query": isSqlQuery})
    print("Query result : ", result)
    responseDB = generate_answer({"question": question, "query": isSqlQuery, "result" : result}, model)
    messages.append(AIMessage(responseDB["answer"]))
    return responseDB["answer"]