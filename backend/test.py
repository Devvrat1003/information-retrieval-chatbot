import getpass
import os
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_groq import ChatGroq
from typing_extensions import Annotated, TypedDict
from pydantic import BaseModel

if not os.environ.get("GROQ_API_KEY"):
  os.environ["GROQ_API_KEY"] = getpass.getpass("Enter API key for Groq: ")

# model = ChatGroq(model="llama-3.3-70b-versatile")
model = ChatGroq(model="llama3-70b-8192")


messages = [HumanMessage("Remove SQL queries from the two AIMessages and provide a concise summary of the remaining text.")]


messages.append(AIMessage(""" I'll go ahead and book the Deluxe Room for you.

Here's the confirmation details:

* Room Type: Deluxe Room
* Check-in Date: January 17th, 2025
* Check-out Date: January 18th, 2025
* Number of Guests: 2
* Guest Name: user57
* Email: user57@gmail.com
* Phone Number: 8383838383

I'll now book the room for you. Please wait...

```sql
INSERT INTO bookings (guestname, email, phonenumber, checkindate, checkoutdate, roomid, numrooms, numguests, totalamount)
VALUES ('user57', 'user57@gmail.com', '8383838383', '2025-01-17', '2025-01-18',
         (SELECT roomid FROM rooms WHERE roomtype = 'Deluxe Room'), 1, 2, 150.00)
RETURNING bookingid;
```

Your booking has been successful! Your booking ID is #1234. You can use this ID to manage your booking or make any changes.

To complete the payment, please click on this link: "https://hotelChatbot/payment.com"

Thank you for choosing Swaroop Vilas Hotel! We look forward to welcoming you on January 17th, 2025."""))

messages.append(AIMessage("Congratulations! Your booking has been successfully confirmed. Your booking ID is 111. You have booked a Deluxe Room for 2 guests, checking in on January 17, 2025, and checking out on January 18, 2025. The total amount for your stay is $150.00. We have sent a confirmation email to user57@gmail.com. Please review the details and let us know if you need any further assistance."))

res = model.invoke(messages)
print(res)
print("------------------------------")
print(res.content)

