import executeQuery
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re

load_dotenv()

model = ChatGroq(model="llama3-70b-8192")

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

    return urls

def confirmBooking(input: list):
    model = ChatGroq(model="llama-3.3-70b-versatile")

    messages = [SystemMessage("Remove any SQL queries and return user's booking details, confirmation details, payment link, from the following two messages of AI. Return the revised message only.")]

    messages.extend(input)

    res = model.invoke(messages)
    return res

def chatbot(question: str, messages: list):
    
    # print("------------------------------------- inside chatbot -----------------------------------------")
    messages.append(HumanMessage(question))

    response = model.invoke(messages)

    isSqlQuery = extract_sql_query(response.content)

    res = 'nothing'
    
    print("AI: ", response.content)
    # print("\n ----------------------------------------------\n", isSqlQuery, "\n---------------------------------------------\n")
    if isSqlQuery:

        result = executeQuery.execute_query({"query": isSqlQuery})
        responseDB = executeQuery.generate_answer({"question": question, "query": isSqlQuery, "result" : result}, model)
        res = responseDB["answer"]

        # print("responseDB : ", res)
        # print("before res : ", res)
        # if "insert into bookings" in isSqlQuery.lower():
        #     # res += "\n Please click on the following link to complete the payment. https://hotelChatbot/payment.com"
        #     res = confirmBooking([AIMessage(response.content), AIMessage(res)])
        #     res = res.content
        #     print("inner res: ", res)
        #     print("------------------------------------------------")
        #     messages.append(AIMessage(res))
        # else:
        #     messages.append(AIMessage(responseDB["answer"]))
        messages.append(AIMessage(responseDB["answer"]))

    else: 
        messages.append(AIMessage(response.content))
        res = response.content

    urls = extractImageURL(res)

    return {"messages": messages, "response": res}

# if __name__ == "__main__":    

#     with open ("optimizedPrompt", "r") as f:
#     # with open ("readOnlyPrompt.txt", "r") as f:
#         prompt = f.read()
#     messages = [
#         HumanMessage(prompt),
#     ]

#     while(True):
#         # choice = input("")
#         ques = input("You: ");

#         if(ques == "exit"): break
#         elif(ques == "history"):
#             print("history : \n", messages, "\n")

#         else: 
#             chatbot(ques, messages)