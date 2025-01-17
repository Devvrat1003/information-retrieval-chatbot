import executeQuery
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re

model = ChatGroq(model="llama3-70b-8192")
# model = ChatGroq(model="llama-3.3-70b-versatile")

def extract_sql_query(text):
    # Regular expression to match the SQL query block
    sql_pattern = r"```sql\n(.*?)```"
    match = re.search(sql_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

 def extract_image_urls_from_llm_response(response):
    # Using LLM to extract image URLs
    messages = [SystemMessage("Extract all image URLs from the given response.")]

    messages.append(HumanMessage(response))

    image_urls = model.invoke(messages)

    return json.loads(image_urls.content) if image_urls.content else None

def checkInsertQuery(input: list):
    model = ChatGroq(model="llama-3.3-70b-versatile")

    messages = [SystemMessage("Given an SQL query, return 1 if it inserts user details in bookings table, otherwise return 0. Directly provide answer, no other details.")]

    messages.append(HumanMessage(input))

    res = model.invoke(messages)

    return res
def chatbot(question: str, messages: list):
    
    # print("------------------------------------- inside chatbot -----------------------------------------")
    messages.append(HumanMessage(question))

    response = model.invoke(messages)

    isSqlQuery = extract_sql_query(response.content)

    res = 'nothing'
    
    print("AI: ", response.content)
    print("\n ----------------------------------------------\n", isSqlQuery, "\n---------------------------------------------\n")
    if isSqlQuery:

        result = executeQuery.execute_query({"query": isSqlQuery})
        responseDB = executeQuery.generate_answer({"question": question, "query": isSqlQuery, "result" : result}, model)
        res = responseDB["answer"]

        insertQuery = checkInsertQuery(isSqlQuery)
        print("is insert: ", insertQuery, "------------------------------------------------")
        if str(insertQuery.content) == '1':
            print("this ran ---------")
            res += "\n Please click on the following link to complete the payment. https://hotelChatbot/payment.com"
        print("responseDB : ", res)
        # print("before res : ", res)
        # if "insert into bookings" in isSqlQuery.lower():
        #     res = confirmBooking([AIMessage(response.content), AIMessage(res)])
        #     res = res.content
        #     print("inner res: ", res)
        #     print("------------------------------------------------")
        #     messages.append(AIMessage(res))
        # else:
        #     messages.append(AIMessage(responseDB["answer"]))
        messages.append(AIMessage(res))

    else: 
        messages.append(AIMessage(response.content))
        res = response.content

    urls = extractImageURL(res)

    return {"messages": messages, "response": res}

# if __name__ == "__main__":    

#     with open ("singleHotelPrompt", "r") as f:
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
