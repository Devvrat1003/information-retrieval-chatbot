from langchain_community.utilities import SQLDatabase
from typing_extensions import Annotated, TypedDict
from langchain_groq import ChatGroq
from langchain_community.tools.sql_database.tool import QuerySQLDatabaseTool
import getpass
import os
from dotenv import load_dotenv
import re

# load_dotenv()

if not os.environ.get("GROQ_API_KEY"):
  os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")

llm = ChatGroq(model="llama3-70b-8192")

# creating application states
class State(TypedDict):
    question: str
    query: str
    result: str 
    answer: str

# # connecting to SQL database
db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

def validateQuery(sql_query: str):
    # Remove extra spaces and convert to lowercase for case-insensitivity
    sql_query = sql_query.strip().lower()

    # Regular expressions for read-only queries
    read_only_patterns = [
        r"^\s*select\s+",          # Queries starting with SELECT
        r"^\s*with\s+.*\s+select\s+"  # Queries starting with WITH followed by SELECT
    ]

    # Forbidden SQL commands (DML, DCL, TCL, and other potentially harmful statements)
    forbidden_statements = [
        # DML Commands
        "insert", "update", "delete", "merge", "replace",
        # DCL Commands
        "grant", "revoke",
        # TCL Commands
        "commit", "rollback", "savepoint", "set transaction", "set session",
        # Other Dangerous Commands
        "drop", "alter", "create", "truncate", "analyze", "repair", "optimize"
    ]

    # Check if any forbidden command exists in the query
    for statement in forbidden_statements:
        if re.search(rf"\b{statement}\b", sql_query, re.IGNORECASE):
            return False

    # Check if the query matches any valid read-only pattern
    return any(re.match(pattern, sql_query, re.IGNORECASE) for pattern in read_only_patterns)

    
class QueryOutput(TypedDict):
    """Generated SQL query."""
    query: Annotated[str, ..., "Syntactically valid SQL query."]

# reading table schema
with open("singleHotelPrompt", 'r') as file:
    getPrompt = file.read()

# get query from question
def write_query(state: State):
    """Generate SQL query to fetch information."""
    prompt = getPrompt + "\nQuestion: " + state["question"]
    structured_llm = llm.with_structured_output(QueryOutput)
    result = structured_llm.invoke(prompt)
    return {"query": result["query"]}

def execute_query(state: State):
    """Execute SQL query."""
    # if(validateQuery(state["query"])):
    execute_query_tool = QuerySQLDatabaseTool(db=db)
    return {"result": execute_query_tool.invoke(state["query"])}

def generate_answer(state:State):
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