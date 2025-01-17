
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
import ast
import json

# Convert the string to a Python list of lists

text = """ We have five types of rooms available at our hotel. Here are the descriptions for each:

Deluxe Room: Queen-sized bed, en-suite bathroom, city view
Suite: King-sized bed, living area, premium amenities
Standard Room: Cozy room with essential amenities
Family Room: Two queen beds, perfect for families
Penthouse: Luxury suite with panoramic city views
Which one of these rooms interests you the most?
"""

model = ChatGroq(model="llama3-70b-8192")

def removeURL(text:str):
    messages = [SystemMessage("Given a text, convert it into markdown code to properly format the text, making it easily readable for user to read. Output : The converted markdown text. Directly provide the markdown, no other details.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    return res



res = removeURL(text)

# list_of_lists = ast.literal_eval(res.content)

# Output the result
# print(type(list_of_lists))

print(res.content)