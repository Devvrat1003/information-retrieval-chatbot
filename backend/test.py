from langchain_community.utilities import SQLDatabase
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

query = "INSERT INTO bookings (guestname, email, phonenumber, checkindate, checkoutdate, roomid, numrooms, numguests, totalamount) VALUES ('Rahul', 'rathoddevvratsingh777@gmail.com', 9191919191, '2025-01-10', '2025-01-12', 2, 1, 1, 600.00);"

print(db.run(query))
