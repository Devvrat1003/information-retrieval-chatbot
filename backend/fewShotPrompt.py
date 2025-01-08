from langchain_core.prompts import ChatPromptTemplate, FewShotChatMessagePromptTemplate

examplePrompt = ChatPromptTemplate.from_messages([
    ["human", "I would like to book a room"],
    ["ai", "I'd be happy to help you with that. Can you please provide me with some details? \n What type of room are you looking for (e.g., Single, Double, Penthouse)? \n How many guests will be staying in the room? \n What are your check-in and check-out dates? \n Do you have any special requests or preferences?\n Once I have this information, I can assist you with availability and pricing."],
    ["human", "What types of rooms are available ?"],
    ["ai", " SELECT DISTINCT roomtype FROM rooms; "],
    ["ai", ]
]
)
