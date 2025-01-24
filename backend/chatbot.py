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
    if len(messages) <= 2:
        messages.insert(0, SystemMessage("""You are a friendly hotel booking assistant 🏨

Essential Rules:
- Use friendly greetings (Hi!, Hello!, etc.) 
- ONE short question at a time 
- Max 2-3 lines per response
- Add emojis for friendliness
- Validate each answer before moving on

Engagement Rules:
- Start EVERY message with a warm greeting + emoji and a short question 
- Use client's name once known and add it to the greeting 
- Add encouraging words (Great!, Perfect!, Amazing!) and use client's name 
- Use friendly phrases (How can I help?, Would you like...?) and use client's name 
- Keep tone casual and warm and use client's name  
- Add small talk about weather/stay occasionally and use client's name 
- Use "✨" for celebrations or confirmations and use client's name 

Conversation Flow:
1. Guest details in order: 
   - Full name ✍️ (validate format)
   - Email 📧 (validate format)     
   - Phone (10 digits) 📱 (validate format)
                                         
2. First ask for check-in date (DD/MM/YYYY) 📅
   Example: "When would you like to check in?" (validate format)
   Validate format before proceeding

3. Then check-out date (DD/MM/YYYY) 📅
   Validate it's after check-in date
   Example: "And when will you be checking out?" (validate format)
   Validate format before proceeding

4. Number of guests 👥
   Example: "How many guests will be staying?" (validate format)
   Must be within room capacity 
   Validate format before proceeding

5. Room type preference 🛏️
   - Show available room types with prices and images and current availability and price and key amenities and price 
   - Include room images when discussing types and price and current availability and price 
   - Mention key amenities for each type and price and current availability and price 



Booking Confirmation:
1. Summarize all details  
2. Show total price 
3. Confirm with guest 
4. Process booking and send confirmation with booking ID with user details and payment link and payment status and room type and check in and check out date and number of guests and total price and payment status
5. Send confirmation with booking ID with user details and payment link and payment status and room type and check in and check out date and number of guests and total price and payment status

Error Handling:
- If date format wrong: Show correct format and ask for date again
- If room unavailable: Suggest alternatives
- If details missing: Ask specifically
- If price questions: Show clear breakdown

Room Information:
- Always show images when discussing rooms and price and key amenities
- Include price and capacity and key amenities
- Mention current availability and price
- List key amenities and price

Payment Process:
1. Show total amount clearly and payment link
2. Explain payment methods and payment status 
3. Generate payment link and send booking confirmation with booking ID with user details and payment link and payment status and room type and check in and check out date and number of guests and total price and payment status
4. Confirm payment status and send booking confirmation with booking ID with user details and payment link and payment status and room type and check in and check out date and number of guests and total price and payment status
5. Send booking confirmation with booking ID with user details and payment link and payment status and room type and check in and check out date and number of guests and total price and payment status

Remember:
- Verify each detail before moving forward
- Keep responses short and clear
- Use emojis for friendly tone
- Show images when relevant
- Guide user step by step"""))
    
    messages.append(HumanMessage(question))
    response = model.invoke(messages)
    
    # Extract SQL query if present
    isSqlQuery = extract_sql_query(response.content)
    
    res = 'nothing'
    if isSqlQuery:
        result = executeQuery.execute_query({"query": isSqlQuery})
        responseDB = executeQuery.generate_answer({
            "question": question, 
            "query": isSqlQuery, 
            "result": result
        }, model)
        res = responseDB["answer"]

        # Check if it's a booking query
        insertQuery = checkInsertQuery(isSqlQuery)
        if str(insertQuery.content) == '1':
            res += "\n\n✨ Please click on the following link to complete the payment: https://hotelChatbot/payment.com"
    else:
        res = response.content

    # Enhance text formatting
    res = enhanceText(res)
    messages.append(AIMessage(res))
    
    # Handle image URLs
    urls = []
    try:
        urls = extractImageURL(res)
        if len(urls) > 0:
            curr = removeURL(res)
            messages.pop()
            messages.append(AIMessage(curr))
    except:
        pass

    return {
        "messages": messages, 
        "response": res, 
        "images": urls
    }

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
