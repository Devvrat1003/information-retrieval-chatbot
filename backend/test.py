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

messages = [SystemMessage("Remove any SQL queries and return user details, confirmation details, payment link,  from the following two messages of AI. Return the revised message only.")]

messages.append(AIMessage("""I'll go ahead and book the Suite for you.
Here's the booking details:

```sql
INSERT INTO bookings (guestname, email, phonenumber, checkindate, checkoutdate, roomid, numrooms, numguests, totalamount)
VALUES ('user42', 'user42@gmail.com', '9393939393', '2025-02-06', '2025-02-07',
         (SELECT roomid FROM rooms WHERE roomtype = 'Suite'), 1, 3, 300.00)
RETURNING bookingid;
```
Your booking has been successfully created. You will receive a booking ID shortly.

To complete the payment, please click on this link: "https://artificialanalysis.ai/leaderboards/models"

Your booking ID is: **[Insert Booking ID here]**

Please note that your booking is pending payment. Once the payment is received, your booking will be confirmed.

Is there anything else I can assist you with?
"""))

messages.append(AIMessage("Your booking has been successfully created! Your booking ID is 75. We have reserved a Suite for you from February 6th, 2025 to February 7th, 2025. We're looking forward to welcoming you to our hotel!"))

res = model.invoke(messages)
print(res)
print(res.content)

