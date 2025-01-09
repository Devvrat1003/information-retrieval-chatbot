from langchain_community.utilities import SQLDatabase
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

query = """SELECT r.RoomType, 
       r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) AS AvailableRooms
FROM Rooms r
LEFT JOIN Bookings b
    ON r.RoomID = b.RoomID
    AND ((b.CheckInDate BETWEEN '2025-01-10' AND '2025-01-15')
         OR (b.CheckOutDate BETWEEN '2025-01-10' AND '2025-01-15')
         OR (b.CheckInDate <= '2025-01-10' AND b.CheckOutDate >= '2025-01-15'))
WHERE r.RoomType = 'Deluxe Room' 
GROUP BY r.RoomID, r.RoomType, r.TotalRooms
HAVING r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) > 0;
"""

print(db.run(query))
