# import re

text = """  I'd be happy to show you our room options. We have five types of rooms: Deluxe Room, Suite, Standard Room, Family Room, and Penthouse. Here are the images:

1. Deluxe Room - https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=
2. Suite - https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg
3. Standard Room - https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=
4. Family Room - https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=
5. Penthouse - https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg](https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg

Which type of room would you like to book? """

# def extractImageURL(text: str):
    
#     """
#     Extract image URLs from the input text based on common image extensions.
#     Returns a list of tuples containing image tags and URLs.
#     """

#     image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp')
    
#     # Regular expression to match URLs
#     url_pattern = r"https?://[^\s]+"
#     urls = re.findall(url_pattern, text)
    
#     # Filter URLs for image extensions
#     image_urls = [
#         (match.group(1), url)
#         for url in urls
#         if any(url.lower().endswith(ext) for ext in image_extensions)
#         if (match := re.search(r'(\b\w+\b):.*$', text))  # Extract image tag
#     ]
    
#     return image_urls

# print(extractImageURL(text))
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
import ast

# Convert the string to a Python list of lists


model = ChatGroq(model="llama3-70b-8192")

def extractImageURL(text:str):
    messages = [SystemMessage("Given a text, extract the all the image URL from the text and also the type of room. Output: an array of array of room type and corresponding url. Only produce the output without any extra text.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)
    return res
res = extractImageURL(text)

list_of_lists = ast.literal_eval(res.content)

# Output the result
print(type(list_of_lists))