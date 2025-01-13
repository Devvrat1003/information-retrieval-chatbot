import executeQuery
from langchain_core.messages import HumanMessage, AIMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re

load_dotenv()

model = ChatGroq(model="llama3-70b-8192")



def askDB(question: str, messages: list):

    query = executeQuery.write_query({"question": question})
    queryRes = executeQuery.execute_query({"query": query})
    responseToUser = executeQuery.generate_answer({"question":question, "query": query, "result": queryRes})

    messages.append(HumanMessage(question))
    messages.append(AIMessage(responseToUser["answer"]))

    print(responseToUser["answer"])

def extract_sql_query(text):
    # Regular expression to match the SQL query block
    sql_pattern = r"```sql\n(.*?)```"
    match = re.search(sql_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def extractImageURL(text: str):
    # Regular expression to find URLs
    url_pattern = r'https?://[\w./?=&%-]+'

    # Extract URLs
    urls = re.findall(url_pattern, text)

    # Print the URLs
    # for url in urls:
        # print(url)
    return urls

def cancelBooking(question: str):
    """Cancel booking of user using their details.

    Args:
        question: str
    """

    pass

def reserveBooking(question: str):
    pass

# Tool creation
tools = [cancelBooking, reserveBooking]
# Tool binding
model_with_tools = model.bind_tools(tools)
# Map To Function
functionMapping = {"cancelBooking": cancelBooking, "reserveBooking": reserveBooking}

def chatbot(question: str, messages: list):

    # print("------------------------------------- inside chatbot -----------------------------------------")
    messages.append(HumanMessage(question))

    ai_msg = model_with_tools.invoke(messages)

    response = model.invoke(messages)

    isSqlQuery = extract_sql_query(response.content)

    res = 'nothing'
    
    print("AI: ", response.content)
    print("\n ----------------------------------------------\n", isSqlQuery, "\n---------------------------------------------\n")
    if isSqlQuery:

        result = executeQuery.execute_query({"query": isSqlQuery})
        responseDB = executeQuery.generate_answer({"question": question, "query": isSqlQuery, "result" : result}, model)
        messages.append(AIMessage(responseDB["answer"]))
        res = responseDB["answer"]

    else: 
        messages.append(response)
        res = response.content

    urls = extractImageURL(res)

    return {"messages": messages, "response": res, "images": [len(messages) - 1, urls]}

if __name__ == "__main__":    

    with open ("singleHotelPrompt", "r") as f:
    # with open ("optimizedPrompt", "r") as f:
        prompt = f.read()
    messages = [
        HumanMessage(prompt),
    ]

    while(True):
        # choice = input("")
        ques = input("You: ");

        if(ques == "exit"): break
        elif(ques == "history"):
            print("history : \n", messages, "\n")

        else: 
            chatbot(ques, messages)