import executeQuery
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import re
import ast
import json
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google.oauth2 import service_account
from googleapiclient.discovery import build
from gtts import gTTS
import base64
import io
from datetime import datetime, timedelta

model = ChatGroq(model="llama3-70b-8192")
#model = ChatGroq(model="llama-3.3-70b-versatile")

# Update the ROOM_IMAGES constant with proper room details
ROOM_DETAILS = {
    "Deluxe Room": {
        "room_id": 1,  # Updated to match the new room ID
        "total_rooms": 10,
        "price": 150.00,
        "max_guests": 2,
        "features": [
            "Queen-sized bed",
            "En-suite bathroom",
            "City view"
        ],
        "images": [
            "https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=",
            "https://www.shutterstock.com/image-photo/hotel-room-interior-modern-seaside-600nw-1387008533.jpg"
        ]
    },
    "Suite": {
        "room_id": 2,  # Updated to match the new room ID
        "total_rooms": 5,
        "price": 300.00,
        "max_guests": 3,
        "features": [
            "King-sized bed",
            "Living area",
            "Premium amenities"
        ],
        "images": [
            "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQM5Q1yWCaCax6Yn_I7NoUKJz96Bp_OMXSCjQ&s"

        ]
    },
    "Standard Room": {
        "room_id": 3,  # Updated to match the new room ID
        "total_rooms": 15,
        "price": 100.00,
        "max_guests": 2,
        "features": [
            "Cozy room with essential amenities"
        ],
        "images": [
            "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
            "https://www.kabayanhotel.com.ph/wp-content/uploads/2016/02/kabayan-standardroom-01.jpg"
        ]
    },
    "Family Room": {
        "room_id": 4,  # Updated to match the new room ID
        "total_rooms": 3,
        "price": 200.00,
        "max_guests": 4,
        "features": [
            "Two queen beds",
            "Perfect for families"
        ],
        "images": [
            "https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=",
            "https://www.samasamahotels.com/wp-content/uploads/2024/07/FamilyRoom1-1980x1000-1.jpeg"

        ]
    },
    "Penthouse": {
        "room_id": 5,  # Updated to match the new room ID
        "total_rooms": 1,
        "price": 500.00,
        "max_guests": 4,
        "features": [
            "Luxury suite with panoramic city views"
        ],
        "images": [
            "https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg",
            "https://www.fairmont-san-francisco.com/content/uploads/2022/05/SAF_Penthouse01_Living_Room-1-1920x922.jpg"

        ]
    }
}

# Google Sheets Configuration
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SERVICE_ACCOUNT_FILE = 'path/to/credentials'  # Make sure this file exists in your backend folder
SPREADSHEET_ID = 'your_spreadsheet_ID'  # Your spreadsheet ID

def extract_sql_query(text):
    # Regular expression to match the SQL query block
    sql_pattern = r"```sql\n(.*?)```"
    match = re.search(sql_pattern, text, re.DOTALL)
    if match:
        return match.group(1).strip()
    return None

def removeURL(text:str):
    messages = [SystemMessage("Given a text, remove all the image URL from the text. Output: Summary of the rest of the text in properly worded form. Only produce the output without any extra text.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    return res

def extractImageURL(text:str):
    # Modify the function to first check for specific room type requests
    for room_type in ROOM_DETAILS:
        if room_type.lower() in text.lower():
            return [[room_type, url] for url in ROOM_DETAILS[room_type]['images']]
    
    # If no specific room type found, use the AI to extract URLs
    messages = [SystemMessage("Given a text, extract all the image URLs from the text and also the type of room. Output: an array of array of room type and corresponding url. Only produce the output without any extra text.")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)
    
    try:
        list_of_lists = ast.literal_eval(res.content)
        return list_of_lists
    except:
        return []

def enhanceText(text: str):
    messages = [SystemMessage("""Convert the following text into Markdown code with the following rules:

1. Make important elements (e.g., headings, room types, or key details) bold or use appropriate Markdown headings (e.g., #, ##, or ###).
2. Add line breaks where necessary to improve readability. 
3. Use lists (-, 1., or *) for enumerations or grouped items.
4. Preserve any meaningful structure, such as paragraphs or sections.
5. Use code blocks (\```) where required, especially for showing examples or templates.
   - For JSX/React code blocks, use: \```jsx
   - For other languages, specify the language after the backticks
6. Ensure the Markdown is clean and easy to read.
7. Add symbols such as (:, -, etc) to improve readability where needed.
8. Properly format links as well.
                              
Note: Directly provide the markdown text without any extra caption or anything.""")]
    messages.append(HumanMessage(text))
    res = model.invoke(messages)

    # Clean up any potential jsx="true" attributes that might cause React warnings
    cleaned_response = res.content.replace('jsx="true"', 'className="language-jsx"')
    return cleaned_response

def checkInsertQuery(input: list):
    model = ChatGroq(model="llama-3.3-70b-versatile")

    messages = [SystemMessage("Given an SQL query, return 1 if it inserts user details in bookings table, otherwise return 0. Directly provide answer, no other details.")]

    messages.append(HumanMessage(input))

    res = model.invoke(messages)

    return res

def text_to_speech(text):
    try:
        # Remove markdown formatting and URLs for cleaner speech
        clean_text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Remove bold
        clean_text = re.sub(r'\[(.*?)\]\(.*?\)', r'\1', clean_text)  # Remove links
        clean_text = re.sub(r'http\S+', '', clean_text)  # Remove URLs
        
        # Create gTTS object
        tts = gTTS(text=clean_text, lang='en')
        
        # Save to bytes buffer
        fp = io.BytesIO()
        tts.write_to_fp(fp)
        fp.seek(0)
        
        # Convert to base64
        audio_base64 = base64.b64encode(fp.read()).decode()
        return audio_base64
    except Exception as e:
        print(f"Error generating speech: {e}")
        return None

def verify_booking_requirements(booking_info):
    """
    Verify all required booking information is present and valid
    Returns (is_complete, missing_field, error_message)
    """
    required_fields = {
        'name': "guest name",
        'email': "email address",
        'phone': "phone number",
        'check_in': "check-in date",
        'check_out': "check-out date",
        'num_guests': "number of guests",
        'room_type': "room type"
    }
    
    # Check for missing fields
    for field, description in required_fields.items():
        if field not in booking_info or not booking_info[field]:
            return False, field, f"Please provide your {description} first."
    
    # Validate each field
    validations = {
        'email': lambda x: bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', x)),
        'phone': lambda x: bool(re.match(r'^\d{10}$', x)),
        'check_in': lambda x: datetime.strptime(x, '%d/%m/%Y').date() >= datetime.now().date(),
        'check_out': lambda x: datetime.strptime(x, '%d/%m/%Y').date() > datetime.strptime(booking_info['check_in'], '%d/%m/%Y').date(),
        'num_guests': lambda x: isinstance(int(x), int) and int(x) > 0 and int(x) <= ROOM_DETAILS[booking_info['room_type']]['max_guests'],
        'room_type': lambda x: x in ROOM_DETAILS
    }
    
    validation_messages = {
        'email': "Please provide a valid email address.",
        'phone': "Please provide a valid 10-digit phone number.",
        'check_in': "Check-in date must be today or a future date.",
        'check_out': "Check-out date must be after check-in date.",
        'num_guests': f"Number of guests must be between 1 and the room's maximum capacity.",
        'room_type': "Please select a valid room type."
    }
    
    for field, validator in validations.items():
        try:
            if not validator(booking_info[field]):
                return False, field, validation_messages[field]
        except:
            return False, field, validation_messages[field]
    
    return True, None, None

def validate_single_question(response_text):
    """
    Enhanced validation to ensure response contains exactly one question.
    Returns True only if there is a single question.
    """
    messages = [SystemMessage("""Analyze if this response contains multiple questions or requests for information.
    Rules:
    - A question ends with ? or a request for information
    - Statements providing information are not questions
    - Greetings and pleasantries are not questions
    - Return 'true' ONLY if there is exactly one question/request
    - Return 'false' if there are multiple questions/requests
    
    Only return 'true' or 'false', nothing else.""")]
    messages.append(HumanMessage(response_text))
    result = model.invoke(messages)
    return result.content.strip().lower() == 'true'

def chatbot(question: str, messages: list):
    if len(messages) <= 2:
        messages.insert(0, SystemMessage("""You are a friendly Swaroop Vilas hotel booking assistant. 🏨

CRITICAL RULES:
1. Ask EXACTLY ONE question per message - no exceptions! ⚠️
2. Wait for user's response before asking the next question ⏳
3. Use emojis to make conversation friendly 😊
4. Keep questions short and clear 📝

Booking flow (ONE question at a time):
1. Greet and ask ONLY for full name 👋
2. Ask ONLY for email 📧
3. Ask ONLY for phone 📱
4. Ask ONLY for number of guests 👥
5. Show room options and ask ONLY for preference 🛏️
6. Ask ONLY for check-in date 📅
7. Ask ONLY for check-out date 📅

Only proceed with booking when ALL required information is collected:
- Full Name
- Email
- Phone
- Number of Guests
- Room Type
- Check-in Date
- Check-out Date

Do not confirm booking until all details are collected and verified.
After collecting all details, show summary and ask for confirmation before proceeding.

Remember: ONE question = ONE message! 🎯"""))

    # Process the response
    messages.append(HumanMessage(question))
    response = model.invoke(messages)
    
    # Keep requesting single question version until valid
    while not validate_single_question(response.content):
        messages.append(SystemMessage("""⚠️ IMPORTANT: Please rephrase your response to ask exactly ONE question.
Add relevant emoji and keep it friendly but focused on one question only."""))
        response = model.invoke(messages)
    
    # Extract any SQL query if present
    sql_query = extract_sql_query(response.content)
    
    if sql_query:
        if "INSERT INTO bookings" in sql_query:
            # Extract booking data
            booking_data = extract_booking_data(sql_query)
            
            # Verify all required information is present
            is_complete, missing_field, error_message = verify_booking_requirements(booking_data)
            
            if not is_complete:
                messages.append(AIMessage(error_message))
                return {
                    "messages": messages,
                    "response": error_message,
                    "images": [],
                    "audio": text_to_speech(error_message)
                }
            
            # Check room availability
            is_available, room_info = check_room_availability_with_details(
                booking_data['room_type'],
                booking_data['check_in'],
                booking_data['check_out']
            )
            
            if not is_available:
                error_msg = f"Sorry, the {booking_data['room_type']} is not available for your selected dates."
                messages.append(AIMessage(error_msg))
                return {
                    "messages": messages,
                    "response": error_msg,
                    "images": [],
                    "audio": text_to_speech(error_msg)
                }
            
            # If everything is valid, proceed with booking
            success, result = save_booking_with_verification(booking_data)
            
            if success:
                confirmation = generate_booking_confirmation(result)
                messages.append(AIMessage(confirmation))
                return {
                    "messages": messages,
                    "response": confirmation,
                    "images": [],
                    "audio": text_to_speech(confirmation)
                }
            else:
                error_msg = f"Sorry, there was an error with your booking: {result}"
                messages.append(AIMessage(error_msg))
                return {
                    "messages": messages,
                    "response": error_msg,
                    "images": [],
                    "audio": text_to_speech(error_msg)
                }
        else:
            # Handle other queries
            result = executeQuery.execute_query({"query": sql_query})
            response_text = executeQuery.generate_answer({
                "question": question,
                "query": sql_query,
                "result": result
            }, model)
            
            enhanced_response = enhanceText(response_text["answer"])
            messages.append(AIMessage(enhanced_response))
            
            # Extract any relevant images
            images = extractImageURL(enhanced_response)
            
            return {
                "messages": messages,
                "response": enhanced_response,
                "images": images,
                "audio": text_to_speech(enhanced_response)
            }
    
    # Handle regular conversation
    enhanced_response = enhanceText(response.content)
    messages.append(AIMessage(enhanced_response))
    
    # Extract any relevant images
    images = extractImageURL(enhanced_response)
    
    return {
        "messages": messages,
        "response": enhanced_response,
        "images": images,
        "audio": text_to_speech(enhanced_response)
    }

def extract_booking_data(query):
    """Extract booking information from SQL query"""
    # Add regex patterns to extract data from INSERT query
    patterns = {
        'name': r"'([^']*)'",  # Matches text between quotes
        'email': r'[\w\.-]+@[\w\.-]+',
        'phone': r'\d{10}',
        'check_in': r'\d{2}/\d{2}/\d{4}',
        'check_out': r'\d{2}/\d{2}/\d{4}',
        'num_guests': r'\d+',
        'room_type': r'(Deluxe Room|Family Room|Standard Room|Suite|Penthouse)'
    }
    
    booking_data = {}
    for field, pattern in patterns.items():
        match = re.search(pattern, query)
        if match:
            booking_data[field] = match.group(0)
    
    return booking_data

# if __name__ == "__main__":    

#     with open ("singleHotelPrompt", "r") as f:
#     # with open ("readOnlyPrompt.txt", "r") as f:
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
def generate_payment_prompt(name, email, phone, room_type, amount, check_in, check_out, payment_link):
    templates = [
        f"Hi {name}! 😊 Ready to confirm your **{room_type}** booking?\n\n" +
        f"📧 Email: **{email}**\n" +
        f"📱 Phone: **{phone}**\n" +
        f"📅 Check-in: **{check_in}**\n" +
        f"📅 Check-out: **{check_out}**\n" +
        f"💰 Total amount: **₹{amount}**\n\n" +
        f"🔒 Secure payment link: {payment_link}",

        f"Hello {name}! Your luxury stay awaits! 🌟\n\n" +
        f"📧 Contact: **{email}**\n" +
        f"📱 Phone: **{phone}**\n" +
        f"🏨 Room: **{room_type}**\n" +
        f"📆 Dates: **{check_in}** to **{check_out}**\n" +
        f"💳 Amount due: **₹{amount}**\n\n" +
        f"Complete your booking here: {payment_link}",

        f"Almost there, {name}! 🎉\n\n" +
        f"Your **{room_type}** reservation details:\n" +
        f"• Email: **{email}**\n" +
        f"• Phone: **{phone}**\n" +
        f"• Check-in: **{check_in}**\n" +
        f"• Check-out: **{check_out}**\n" +
        f"• Total: **₹{amount}**\n\n" +
        f"Secure your booking: {payment_link}"
    ]
    
    import random
    return random.choice(templates)

# Example Usage - Update this part
name = "Arjun"
email = "arjun@example.com"
phone = "1234567890"
room_type = "Deluxe Room"
amount = 12000
check_in = "12/02/2025"
check_out = "15/02/2025"
payment_link = "https://hotelchatbot.com/payment/secure/12345"

prompt = generate_payment_prompt(name, email, phone, room_type, amount, check_in, check_out, payment_link)
print(prompt)

def test_google_sheets_connection():
    """Test Google Sheets connectivity and write permissions"""
    try:
        # Verify if credentials file exists
        if not os.path.exists(SERVICE_ACCOUNT_FILE):
            return False, "Credentials file not found. Please ensure credentials.json exists in the backend folder."

        # Create credentials
        try:
            creds = service_account.Credentials.from_service_account_file(
                SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        except Exception as e:
            return False, f"Invalid credentials file: {str(e)}"

        # Build service
        try:
            service = build('sheets', 'v4', credentials=creds)
        except Exception as e:
            return False, f"Failed to build sheets service: {str(e)}"

        # First verify spreadsheet exists and is accessible
        try:
            # Get spreadsheet metadata first
            spreadsheet = service.spreadsheets().get(
                spreadsheetId=SPREADSHEET_ID
            ).execute()
            
            # Check if 'Bookings' sheet exists
            sheet_exists = False
            for sheet in spreadsheet['sheets']:
                if sheet['properties']['title'] == 'Bookings':
                    sheet_exists = True
                    break
            
            if not sheet_exists:
                # Create Bookings sheet if it doesn't exist
                body = {
                    'requests': [{
                        'addSheet': {
                            'properties': {
                                'title': 'Bookings',
                                'gridProperties': {
                                    'rowCount': 1000,
                                    'columnCount': 11
                                }
                            }
                        }
                    }]
                }
                service.spreadsheets().batchUpdate(
                    spreadsheetId=SPREADSHEET_ID,
                    body=body
                ).execute()
                
                # Add headers
                headers = [['Booking ID', 'Guest Name', 'Email', 'Phone', 
                          'Check-in', 'Check-out', 'Room Type', 'Guests', 
                          'Amount', 'Status', 'Timestamp']]
                service.spreadsheets().values().update(
                    spreadsheetId=SPREADSHEET_ID,
                    range='Bookings!A1:K1',
                    valueInputOption='RAW',
                    body={'values': headers}
                ).execute()

        except Exception as e:
            return False, f"Failed to access/create spreadsheet: {str(e)}"

        # Try writing test data
        try:
            current_time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            test_booking = [
                [
                    f'TEST_{datetime.now().strftime("%Y%m%d%H%M%S")}',  # Booking ID
                    'Test Guest',                                        # Guest Name
                    'test@example.com',                                  # Email
                    '1234567890',                                       # Phone
                    '2024-01-27',                                       # Check-in
                    '2024-01-28',                                       # Check-out
                    'Deluxe Room',                                      # Room Type
                    '2',                                                # Guests
                    '5000',                                             # Amount
                    'Test',                                             # Status
                    current_time                                        # Timestamp
                ]
            ]
            
            result = service.spreadsheets().values().append(
                spreadsheetId=SPREADSHEET_ID,
                range='Bookings!A:K',
                valueInputOption='USER_ENTERED',
                insertDataOption='INSERT_ROWS',
                body={'values': test_booking}
            ).execute()

            # Verify the data was written by reading it back
            updated_range = result.get('updates').get('updatedRange')
            verification = service.spreadsheets().values().get(
                spreadsheetId=SPREADSHEET_ID,
                range=updated_range
            ).execute()

            if verification.get('values'):
                return True, f"SUCCESS: Connection successful! Test data written and verified in range {updated_range}"
            else:
                return False, "ERROR: Data write could not be verified"

        except Exception as e:
            return False, f"Failed to write/verify test data: {str(e)}"

    except Exception as e:
        error_msg = str(e)
        if "invalid_grant" in error_msg.lower():
            return False, "ERROR: Invalid credentials. Please check your service account key."
        elif "not found" in error_msg.lower():
            return False, "ERROR: Spreadsheet not found. Please check your spreadsheet ID."
        elif "permission" in error_msg.lower():
            return False, "ERROR: Permission denied. Please share the spreadsheet with your service account email."
        else:
            return False, f"ERROR: {error_msg}"

def save_booking_to_sheet(booking_data):
    """Save booking details to Google Sheets with enhanced error handling and complete data"""
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        
        # Format dates properly
        check_in = datetime.strptime(booking_data['check_in'], '%Y-%m-%d').strftime('%d/%m/%Y') if '-' in booking_data['check_in'] else booking_data['check_in']
        check_out = datetime.strptime(booking_data['check_out'], '%Y-%m-%d').strftime('%d/%m/%Y') if '-' in booking_data['check_out'] else booking_data['check_out']
        
        # Format all booking details for sheets
        row_data = [
            [  # Wrap in an additional list for proper sheets format
                booking_data.get('booking_id', ''),
                booking_data.get('guest_name', ''),
                booking_data.get('email', ''),
                booking_data.get('phone', ''),
                check_in,
                check_out,
                booking_data.get('room_type', ''),
                str(booking_data.get('num_guests', '')),
                str(booking_data.get('amount', '')),
                'Pending',  # Initial payment status
                datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # Timestamp
            ]
        ]

        result = service.spreadsheets().values().append(
            spreadsheetId=SPREADSHEET_ID,
            range='Bookings!A:K',  # Updated to match 11 columns
            valueInputOption='USER_ENTERED',  # Changed from 'RAW' to handle date formats
            insertDataOption='INSERT_ROWS',
            body={'values': row_data}
        ).execute()

        # Verify the data was written
        updated_range = result.get('updates').get('updatedRange')
        verification = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=updated_range
        ).execute()

        if not verification.get('values'):
            raise Exception("Data write could not be verified")

        print(f"✅ Booking saved to Google Sheets: {booking_data['booking_id']}")
        return True

    except Exception as e:
        print(f"❌ Error saving to Google Sheets: {str(e)}")
        return False

def check_room_availability(room_type, check_in, check_out):
    """
    Check if any room of the specified type is available for the given dates
    """
    query = """
    SELECT r.room_id 
    FROM rooms r
    WHERE r.room_type = %s
    AND r.room_id NOT IN (
        SELECT b.room_id 
        FROM bookings b 
        WHERE b.payment_status = 'Confirmed'
        AND (
            (b.check_in <= %s AND b.check_out >= %s)
            OR (b.check_in <= %s AND b.check_out >= %s)
            OR (b.check_in >= %s AND b.check_out <= %s)
        )
    )
    LIMIT 1
    """
    
    result = executeQuery.execute_query({
        "query": query,
        "params": (room_type, check_in, check_out, check_in, check_in, check_in, check_out)
    })
    
    return len(result) > 0, result[0]['room_id'] if result else None

def verify_booking_details(booking_id):
    """Verify booking exists in both database and Google Sheets"""
    # Check database
    query = """
    SELECT booking_id, guest_name, email, phone, room_id, 
           check_in, check_out, num_guests, amount, payment_status
    FROM bookings 
    WHERE booking_id = %s
    """
    
    db_result = executeQuery.execute_query({
        "query": query,
        "params": (booking_id,)
    })
    
    if not db_result:
        return False, "Booking not found in database"
    
    # Verify in Google Sheets
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        
        sheet_range = 'Bookings!A:J'
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=sheet_range
        ).execute()
        
        values = result.get('values', [])
        for row in values:
            if row[0] == booking_id:
                return True, db_result[0]
                
        return False, "Booking not found in Google Sheets"
        
    except Exception as e:
        return False, f"Error verifying in Google Sheets: {str(e)}"

def check_room_availability_with_details(room_type, check_in, check_out):
    """Check room availability and return detailed information"""
    try:
        # First verify the room type exists
        if room_type not in ROOM_DETAILS:
            print(f"Invalid room type: {room_type}")
            return False, None
            
        query = """
        SELECT r.room_id, r.room_type
        FROM rooms r
        WHERE r.room_type = %s
        AND r.room_id NOT IN (
            SELECT b.room_id 
            FROM bookings b 
            WHERE b.payment_status = 'Confirmed'
            AND (
                (b.check_in <= %s AND b.check_out >= %s)
                OR (b.check_in <= %s AND b.check_out >= %s)
                OR (b.check_in >= %s AND b.check_out <= %s)
            )
        )
        LIMIT 1
        """
        
        result = executeQuery.execute_query({
            "query": query,
            "params": (room_type, check_in, check_out, check_in, check_in, check_in, check_out)
        })
        
        if result and len(result) > 0:
            room_info = {
                'room_id': result[0]['room_id'],
                'room_type': result[0]['room_type'],
                'price': ROOM_DETAILS[room_type]['price'],
                'features': ROOM_DETAILS[room_type]['features']
            }
            return True, room_info
            
        return False, None
        
    except Exception as e:
        print(f"Error checking room availability: {str(e)}")
        return False, None

def generate_booking_prompts(current_info=None):
    """Generate appropriate prompts based on missing information"""
    required_fields = {
        'name': "What is your full name?",
        'email': "Please provide your email address (example@domain.com):",
        'phone': "Please provide your 10-digit phone number:",
        'check_in': "What is your desired check-in date? (DD/MM/YYYY):",
        'check_out': "What is your desired check-out date? (DD/MM/YYYY):",
        'num_guests': "How many guests will be staying?",
        'room_type': "Which type of room would you prefer? Available options:\n" + \
                    "\n".join([f"- {room} (₹{details['price']} per night, max {details['max_guests']} guests)" 
                             for room, details in ROOM_DETAILS.items()])
    }
    
    if not current_info:
        return required_fields['name']
    
    missing_fields = []
    for field, prompt in required_fields.items():
        if field not in current_info or not current_info[field]:
            missing_fields.append((field, prompt))
    
    if missing_fields:
        return missing_fields[0][1]
    
    return None

def validate_booking_info(field, value):
    """Validate individual booking information fields"""
    validations = {
        'email': lambda x: re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', x),
        'phone': lambda x: re.match(r'^\d{10}$', x),
        'check_in': lambda x: datetime.strptime(x, '%d/%m/%Y').date() >= datetime.now().date(),
        'check_out': lambda x: datetime.strptime(x, '%d/%m/%Y').date() > datetime.strptime(current_info['check_in'], '%d/%m/%Y').date() if 'check_in' in current_info else True,
        'num_guests': lambda x: isinstance(x, int) and x > 0 and (x <= ROOM_DETAILS[current_info['room_type']]['max_guests'] if 'room_type' in current_info else True),
        'room_type': lambda x: x in ROOM_DETAILS
    }
    
    if field in validations:
        try:
            return validations[field](value)
        except:
            return False
    return True

def generate_booking_confirmation(booking_details):
    """Generate booking confirmation message with payment link"""
    confirmation = f"""
🎉 **Booking Confirmation**

Dear **{booking_details['guest_name']}**,

Your booking details:
🔖 Booking ID: **{booking_details['booking_id']}**
📧 Email: **{booking_details['email']}**
📱 Phone: **{booking_details['phone']}**
🏨 Room Type: **{booking_details['room_type']}**
👥 Number of guests: **{booking_details['num_guests']}**
📅 Check-in: **{booking_details['check_in']}**
📅 Check-out: **{booking_details['check_out']}**
💰 Total amount: **₹{booking_details['amount']}**

To complete your booking, please proceed with the payment:
🔒 Payment link: https://hotelChatbot/payment.com

Your room will be confirmed after payment completion.

Need help? Contact us at support@swaroopvilas.com
"""
    return confirmation

def check_booking_in_sheet(booking_id):
    """Check if a booking exists in Google Sheets"""
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('sheets', 'v4', credentials=creds)
        
        # Get all values from the sheet
        result = service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range='Bookings!A:I'
        ).execute()
        
        values = result.get('values', [])
        
        # Check if booking_id exists in any row
        for row in values:
            if row and row[0] == booking_id:
                return True, {
                    'booking_id': row[0],
                    'guest_name': row[1],
                    'email': row[2],
                    'phone': row[3],
                    'check_in': row[4],
                    'check_out': row[5],
                    'room_type': row[6],
                    'amount': row[7],
                    'payment_status': row[8]
                }
        
        return False, "Booking not found in Google Sheets"
        
    except Exception as e:
        return False, f"Error checking Google Sheets: {str(e)}"

def save_booking_with_verification(booking_data):
    """Save booking and verify it was saved correctly"""
    try:
        # First verify all required information is present
        is_complete, missing_field, error_message = verify_booking_requirements(booking_data)
        if not is_complete:
            return False, error_message
        
        # Save to database
        success, result = save_booking(booking_data)
        if not success:
            return False, "Failed to save booking to database"
            
        # Save to Google Sheets
        sheet_saved = save_booking_to_sheet({
            'booking_id': result['booking_id'],
            'guest_name': booking_data['name'],
            'email': booking_data['email'],
            'phone': booking_data['phone'],
            'check_in': booking_data['check_in'],
            'check_out': booking_data['check_out'],
            'room_type': booking_data['room_type'],
            'num_guests': booking_data['num_guests'],
            'amount': ROOM_DETAILS[booking_data['room_type']]['price'],
            'status': 'Pending',
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        })
        
        if not sheet_saved:
            print("Warning: Failed to save to Google Sheets")
            
        return True, result

    except Exception as e:
        print(f"Error in save_booking_with_verification: {str(e)}")
        return False, str(e)

def save_booking(booking_data):
    """Save booking details to database and Google Sheets with enhanced error handling"""
    try:
        # Check room availability first
        is_available, available_room_id = check_room_availability(
            booking_data['room_type'],
            booking_data['check_in'],
            booking_data['check_out']
        )
        
        if not is_available:
            return False, "No rooms available for the selected dates"
            
        # Generate booking ID
        booking_id = f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}"
            
        # Prepare complete booking details
        booking_details = {
            'booking_id': booking_id,
            'guest_name': booking_data['name'],
            'email': booking_data['email'],
            'phone': booking_data['phone'],
            'room_id': available_room_id,
            'room_type': booking_data['room_type'],  # Added room_type
            'check_in': booking_data['check_in'],
            'check_out': booking_data['check_out'],
            'num_guests': booking_data.get('num_guests', 1),  # Added num_guests
            'amount': ROOM_DETAILS[booking_data['room_type']]['price'],
            'payment_status': 'Pending'
        }
        
        # Insert booking into database
        query = """
        INSERT INTO bookings (
            booking_id, guest_name, email, phone, room_id, 
            check_in, check_out, amount, payment_status
        ) VALUES (
            %s, %s, %s, %s, %s, %s, %s, %s, %s
        )
        """
        
        executeQuery.execute_query({
            "query": query,
            "params": (
                booking_details['booking_id'],
                booking_details['guest_name'],
                booking_details['email'],
                booking_details['phone'],
                booking_details['room_id'],
                booking_details['check_in'],
                booking_details['check_out'],
                booking_details['amount'],
                booking_details['payment_status']
            )
        })
        
        # Save to Google Sheet with enhanced error handling
        sheet_saved = save_booking_to_sheet(booking_details)
        if not sheet_saved:
            print("Warning: Failed to save to Google Sheets, but database update successful")
            
        return True, booking_details
        
    except Exception as e:
        print(f"Error saving booking: {e}")
        return False, str(e)

def test_booking_flow():
    """Test the entire booking flow with detailed error logging"""
    try:
        print("Starting test booking flow...")
        
        # Create test booking data
        test_booking = {
            'name': f'Test User {datetime.now().strftime("%H%M%S")}',
            'email': 'test@example.com',
            'phone': '1234567890',
            'room_type': 'Deluxe Room',
            'check_in': datetime.now().strftime('%Y-%m-%d'),
            'check_out': (datetime.now() + timedelta(days=2)).strftime('%Y-%m-%d'),
            'num_guests': 2
        }
        
        print("1. Testing room availability...")
        is_available, room_info = check_room_availability_with_details(
            test_booking['room_type'],
            test_booking['check_in'],
            test_booking['check_out']
        )
        
        if not is_available:
            error_msg = "No rooms available for testing"
            print(f"Error: {error_msg}")
            return None
            
        print("2. Room is available, proceeding with booking...")
        
        # Add room_id to booking data
        test_booking['room_id'] = room_info['room_id']
        
        print("3. Saving booking to database and sheets...")
        success, result = save_booking_with_verification(test_booking)
        
        if not success:
            error_msg = f"Booking failed: {result}"
            print(f"Error: {error_msg}")
            return None
            
        booking_details = result
        print(f"4. Booking created successfully with ID: {booking_details['booking_id']}")
        
        print("5. Verifying booking in database and sheets...")
        verified, details = verify_booking_details(booking_details['booking_id'])
        
        if not verified:
            error_msg = f"Booking verification failed: {details}"
            print(f"Error: {error_msg}")
            return None
            
        print("✅ Test booking flow completed successfully!")
        return booking_details

    except Exception as e:
        print(f"❌ Error in test_booking_flow: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
