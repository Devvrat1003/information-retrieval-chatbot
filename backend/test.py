from langchain_community.utilities import SQLDatabase
import os
from dotenv import load_dotenv

load_dotenv()

db = SQLDatabase.from_uri(os.environ.get("DATABASE_URI"))

query = "Select * from rooms"

print(db.run(query))
