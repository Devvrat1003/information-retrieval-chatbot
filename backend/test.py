# from langchain_community.utilities import SQLDatabase
# import os
# from dotenv import load_dotenv
# import chatbot

# load_dotenv()

# db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

# query = "sdhflsdkjf dkfhsdc sdlifh  SELECT r.RoomType, r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) AS AvailableRooms FROM Rooms r LEFT JOIN Bookings b ON r.RoomID = b.RoomID AND ((b.CheckInDate BETWEEN '2025-01-10' AND '2025-01-15') OR (b.CheckOutDate BETWEEN 2025-01-10' AND '2025-01-15') OR (b.CheckInDate <= '2025-01-10' AND b.CheckOutDate >= '2025-01-15')) WHERE r.RoomType = 'Deluxe Room' GROUP BY r.RoomID, r.RoomType, r.TotalRooms HAVING r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) > 0; skjsdgfdjhh select * from rooms; "

# text = """
# Here is some text with an SQL query:
# SELECT * FROM users WHERE id = 1;
# And here's another:
# INSERT INTO users (name, email) VALUES ('John Doe', 'john@example.com');
# """
# # print(db.run(query))
# print(chatbot.extract_sql_query(text))
import re

def extract_sql_queries(text):
    """
    Extracts SQL queries from a given text.

    Parameters:
        text (str): The input text containing SQL queries.

    Returns:
        list: A list of extracted SQL queries.
    """
    queries = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "WITH"]
    # queries = ["select", "insert", "update", "delete", "create, , "drop", "alter", "with"]
    # curr = text.split()
    # for i in range(len(curr)):
    #     curr[i] = curr[i].lower()
    
    # print(curr)
    # for i in range(len(curr)):
    #     if isQuery:
    #         currQuery += curr[i]
    #         # print(currQuery)
        
    #     elif ';' in curr[i]:
    #         print(curr[i], "with ;")
    #         currQuery += curr[i]
    #         res.append(currQuery)
    #         isQuery = False
    #         currQuery = ""
        
    #     else:
    #         for j in queries:
    #             if j in curr[i]:
    #                 print(curr[i], "this ran")
    #                 isQuery = True
    #                 currQuery += j
    #                 break
    text.lower()
    conditions = ["```", "```sql"]
    sql = ""
    # for i in range(len(conditions)):
    if text.find("```sql"):
        i = text.find("```sql") + 6
    else: 
        i = text.find("```") + 3

    start = i

    # print(text[start::])
    temp = text[start::]
    end = temp[::-1].find("```")

    end = len(temp) - end
    print(text[start:end + 3])
    # print(text[start:end + 1])
    # sql += text[start:end + 3]
    # return sql
# Example usage
text = """
```sql
SELECT r.RoomType, 
       r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) AS AvailableRooms
FROM Rooms r
LEFT JOIN Bookings b
    ON r.RoomID = b.RoomID
    AND ((b.CheckInDate BETWEEN '2025-01-29' AND '2025-01-31')
         OR (b.CheckOutDate BETWEEN '2025-01-29' AND '2025-01-31')
         OR (b.CheckInDate <= '2025-01-29' AND b.CheckOutDate >= '2025-01-31'))
WHERE r.RoomType = 'Deluxe Room' 
GROUP BY r.RoomID, r.RoomType, r.TotalRooms
HAVING r.TotalRooms - COALESCE(SUM(b.NumRooms), 0) > 0;
```dffgdfh
"""
queries = extract_sql_queries(text)
print(queries, "sql")


