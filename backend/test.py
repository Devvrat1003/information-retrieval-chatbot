import getpass
import os
from langchain_core.tools import tool

if not os.environ.get("GROQ_API_KEY"):
  os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")

from langchain_groq import ChatGroq

from typing_extensions import Annotated, TypedDict
from pydantic import BaseModel

model = ChatGroq(model="llama-3.3-70b-versatile")

from langchain_core.messages import HumanMessage, SystemMessage, AIMessage

messages = [SystemMessage("Given an SQL query, return 1 if it inserts user details in bookings table, otherwise return 0. Directly provide answer, no other details.")]

messages.append(HumanMessage('''INSERT INTO bookings (guestname, email, phonenumber, checkindate, checkoutdate, roomid, numrooms, numguests, totalamount)
VALUES ('user42', 'user42@gmail.com', '9393939393', '2025-02-06', '2025-02-07',
         (SELECT roomid FROM rooms WHERE roomtype = 'Suite'), 1, 3, 300.00)
RETURNING bookingid;'''))

res = model.invoke(messages)
print(res)
print("------------------------------")
print(res.content)

