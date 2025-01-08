from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

examplePrompt = ChatPromptTemplate.from_messages([
    ["human", "I want to book a room from Jan 10th to Jan 12th."],
    ["ai", "Sure! May I know how many rooms you need and the total number of guests?"],
    ["human", "I need 2 rooms for 4 people."],
    ["ai", "Thank you! For 2 rooms and 4 guests, we have the following options available:\n"
        "1. Two Deluxe Rooms: $150/night per room (up to 2 guests per room)\n"
        "2. One Suite: $300/night (up to 3 guests, with an extra bed for $50)\n"
        "Would you like to book two Deluxe Rooms or one Suite?"],
    ["human", "I’ll take two Deluxe Rooms."],
    ["ai", "Great choice! Here are the details:\n"
        "- Room Type: Deluxe Room (2 rooms)\n"
        "- Total Guests: 4\n"
        "- Check-in: Jan 10th\n"
        "- Check-out: Jan 12th\n"
        "- Total Price: $600\n"
        "May I have your name, email, and phone number to proceed with the booking?"],
    ["human", "My name is John Doe, email johndoe@example.com, phone 123-456-7890."],
    ["ai", "Thank you, John! Your booking details are as follows:\n"
        "- Guest Name: John Doe\n"
        "- Contact: johndoe@example.com, 123-456-7890\n"
        "- Room Type: Deluxe Room (2 rooms)\n"
        "- Total Price: $600\n"
        "To confirm the booking, please complete the payment using this link: [Payment Link]. "
        "Let me know once you’ve completed the payment."],
    ["human", "I’ve completed the payment."],
    ["ai", "Thank you for the payment! Your booking is now confirmed. Here’s the summary:\n"
        "- Guest Name: John Doe\n"
        "- Room Type: Deluxe Room (2 rooms)\n"
        "- Total Guests: 4\n"
        "- Check-in: Jan 10th\n"
        "- Check-out: Jan 12th\n"
        "- Total Price: $600\n"
        "We look forward to hosting you! Let us know if you have any special requests."],
    ["human", "Can I request a crib for my room?"],
    ["ai", "Absolutely! I’ve noted your request for a crib. It will be ready in your room before check-in. "
        "Is there anything else I can assist you with?"],
    ["human", "Can I extend my stay until Jan 13th?"],
    ["ai", "Let me check availability. The Deluxe Room is available for Jan 13th. "
        "The additional cost will be $150 for one more night per room. Shall I update your booking?"],
    ["human", "I need 3 rooms for 8 people."],
    ["ai", "For 8 guests, we can offer:\n"
        "- 4 Deluxe Rooms: $150/night per room (up to 2 guests per room)\n"
        "- 2 Suites: $300/night per suite (up to 3 guests per suite)\n"
        "Unfortunately, we don't have 3 rooms of the same type available. Which option works for you?"]
])
