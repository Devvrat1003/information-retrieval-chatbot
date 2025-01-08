import executeQuery
from langchain_core.messages import HumanMessage, AIMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re

# load_dotenv()

model = ChatGroq(model="llama3-70b-8192")

prompt_template = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
        ),
        MessagesPlaceholder(variable_name="messages"),
    ]
)

# def fewShotPrompting():

#     examplePrompt = fewShotPrompt.examplePrompt
#     print(examplePrompt)
#     few_shot_prompt = FewShotChatMessagePromptTemplate(
#         example_prompt=examplePrompt,
#         input_variables=[]  # no input variables
#     )

#     final_prompt = ChatPromptTemplate.from_messages([
#         ["system", "You are a wondrous wizard of math."],
#         few_shot_prompt,
#         ["human", "{input}"],
#     ])

#     prompt = FewShotPromptTemplate(
#         examples=examples,
#         example_prompt=example_prompt,
#         suffix="Question: {input}",
#         input_variables=["input"],
#     )

#     print(
#         prompt.invoke({"input": "Who was the father of Mary Ball Washington?"}).to_string()
#     )

def askDB(question: str, messages: list):

    query = executeQuery.write_query({"question": question})
    queryRes = executeQuery.execute_query({"query": query})
    responseToUser = executeQuery.generate_answer({"question":question, "query": query, "result": queryRes})

    messages.append(HumanMessage(question))
    messages.append(AIMessage(responseToUser["answer"]))

    print(responseToUser["answer"])

def extract_sql_query(text):
    # Regular expression to match the SQL query block
    sql_pattern = r"```sql\n(.*?)```"
    match = re.search(sql_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def chatbot(question: str, messages: list):
    # print("------------------------------------- inside chatbot -----------------------------------------")
    messages.append(HumanMessage(question))

    # print("YOU : ", question)
    response = model.invoke(messages)

    isSqlQuery = extract_sql_query(response.content)

    res = 'nothing'

    # print("\n ----------------------------------------------\n", isSqlQuery, "\n---------------------------------------------\n")
    if isSqlQuery:
        result = executeQuery.execute_query({"query": isSqlQuery})
        responseDB = executeQuery.generate_answer({"question": question, "query": isSqlQuery, "result" : result})
        messages.append(AIMessage(responseDB["answer"]))
        res = responseDB["answer"]

    else: 
        messages.append(AIMessage(response.content))
        res = response.content
    # print("YOU : " question)

    # print("AI: ", res)
    return {"messages": messages, "response": res}

# if __name__ == "__main__":    

#     # with open ("singleHotelPrompt", "r") as f:
#     with open ("optimizedPrompt", "r") as f:
#         prompt = f.read()
#     messages = [
#         HumanMessage(prompt),
#     ]

#     while(True):
#         # choice = input("")
#         ques = input("You: ");

#         if(ques == "exit"): break
#         elif(ques == "history"):
#             print("history : \n", messages, "\n")

#         else: 
#             chatbot(ques, messages)