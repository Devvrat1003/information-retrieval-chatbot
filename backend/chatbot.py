import executeQuery
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re
import ast
import json

model = ChatGroq(model="llama3-70b-8192")
# model = ChatGroq(model="llama-3.3-70b-versatile")

def extract_sql_query(text):
    # Regular expression to match the SQL query block
    sql_pattern = r"```sql\n(.*?)```"
    match = re.search(sql_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def removeURL(text:str):
    messages = [SystemMessage("Given a text, remove all the image URL from the text. Output: Summary of the rest of the text in properly worded form. Only produce the output without any extra text.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    return res

def extractImageURL(text:str):
    messages = [SystemMessage("Given a text, extract the all the image URL from the text and also the type of room. Output: an array of array of room type and corresponding url. Only produce the output without any extra text.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    list_of_lists = ast.literal_eval(res.content)
    
    return list_of_lists

def enhanceText(text: str):
    messages = [SystemMessage("""Convert the following text into Markdown code with the following rules:

1. Make important elements (e.g., headings, room types, or key details) bold or use appropriate Markdown headings (e.g., #, ##, or ###).
2. Add line breaks where necessary to improve readability.
3. Use lists (-, 1., or *) for enumerations or grouped items.
4. Preserve any meaningful structure, such as paragraphs or sections.
5. Use code blocks (\```) where required, especially for showing examples or templates.
6. Ensure the Markdown is clean and easy to read.
7. Add symbols such as (:, -, etc) to improve readability where needed.
8. Properly format links as well.
                              
Note: Directly provide the markdown text without any extra caption or anything.""")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    return res.content

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
    print("You: ", question)
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
        # messages.append(AIMessage(res))

    else: 
        # messages.append(AIMessage(response.content))
        res = response.content

    print("Text before : ", res)
    res = enhanceText(res)
    print("Text After : ", res)
    messages.append(AIMessage(res))
    urls = []
    try:
        urls = extractImageURL(res)
        if(len(urls) > 0): 
            curr = removeURL(res)
            messages.pop()
            messages.append(curr)
    except: 
        pass

    return {"messages": messages, "response": res, "images": urls}

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
