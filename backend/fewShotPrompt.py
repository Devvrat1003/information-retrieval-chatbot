from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

examplePrompt = ChatPromptTemplate.from_messages([
    ["human", "I would like to book a room"],
    ["ai", " SELECT DISTINCT roomtype FROM rooms; "],
    ["ai", " Here are the distinct rooms that are available: "],
    ["""Let me display the results for you:
        * Deluxe
        * Superior
        * Penthouse
        * Suite
        * Economy
        * Family Room

        Which one of these room types interests you?"""
    ],
    [" i want to book for 12th to 14th January"],
    ["ai", """ SELECT r.roomtype, r.availability
    FROM rooms r
    LEFT JOIN roomallocations ra ON r.roomid = ra.roomid
    LEFT JOIN bookings b ON ra.bookingid = b.bookingid
    WHERE (b.checkindate > '2025-01-14' OR b.checkoutdate < '2025-01-12')
    OR (b.checkindate IS NULL AND b.checkoutdate IS NULL)
    GROUP BY r.roomtype, r.availability
    HAVING COUNT(r.roomid) < r.availability; """],
    ["ai", " Hi there! I've checked our room availability for you. Currently, we have 5 Suites, 3 Family Rooms, and 15 Standard Rooms available for booking. Would you like to book one of these rooms or would you like me to assist you with something else?"]
])
