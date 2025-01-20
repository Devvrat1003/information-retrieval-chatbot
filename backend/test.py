import os
from datetime import datetime
from typing import Dict, List, Optional
from pydantic import BaseModel, EmailStr
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from langchain_groq import ChatGroq
from langchain.chains.conversation.memory import ConversationBufferMemory
import psycopg2
from psycopg2.extras import RealDictCursor

# Database connection function
def get_db_connection():
    return psycopg2.connect(
        host="your_host",
        database="your_db",
        user="your_user",
        password="your_password"
    )

# Pydantic models for data validation
class BookingRequest(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    num_guests: int
    guest_name: str
    email: EmailStr
    phone_number: str
    room_type: str
    num_rooms: int

class BookingUpdate(BaseModel):
    booking_id: int
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    num_guests: Optional[int] = None
    num_rooms: Optional[int] = None

# Hotel Chatbot class
class HotelChatbot:
    def __init__(self, groq_api_key: str):
        self.llm = ChatGroq(api_key=groq_api_key)
        self.memory = ConversationBufferMemory(memory_key="chat_history")
        
        # Initialize conversation chain
        conversation_prompt = PromptTemplate(
            input_variables=["chat_history", "human_input"],
            template="""You are a helpful hotel booking assistant. Be polite and professional.
            Previous conversation:
            {chat_history}
            Human: {human_input}
            Assistant:"""
        )
        
        self.conversation_chain = LLMChain(
            llm=self.llm,
            prompt=conversation_prompt,
            memory=self.memory
        )

    def get_hotel_info(self) -> str:
        """Query database for hotel information and amenities"""
        conn = get_db_connection()
        try:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                # Get room types and prices
                cur.execute("""
                    SELECT RoomType, Description, PricePerNight, MaxCapacity 
                    FROM Rooms 
                    WHERE Availability > 0
                """)
                rooms = cur.fetch_all()
                
                # Get amenities
                cur.execute("SELECT name, description FROM amenities WHERE availabilitystatus = true")
                amenities = cur.fetchall()
                
                # Format response
                response = "Our hotel offers the following accommodations:\n\n"
                for room in rooms:
                    response += f"- {room['roomtype']}: {room['description']}\n"
                    response += f"  Price per night: ${room['pricepernight']:.2f}\n"
                    response += f"  Maximum capacity: {room['maxcapacity']} guests\n\n"
                
                response += "\nAmenities available:\n"
                for amenity in amenities:
                    response += f"- {amenity['name']}: {amenity['description']}\n"
                
                return response
        finally:
            conn.close()

    def check_room_availability(self, check_in: datetime, check_out: datetime, 
                              room_type: str, num_rooms: int) -> bool:
        """Check if requested rooms are available for given dates"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT COUNT(*) FROM Rooms r
                    WHERE r.RoomType = %s
                    AND r.Availability >= %s
                    AND r.RoomID NOT IN (
                        SELECT RoomID FROM Bookings
                        WHERE (CheckInDate <= %s AND CheckOutDate >= %s)
                        OR (CheckInDate <= %s AND CheckOutDate >= %s)
                    )
                """, (room_type, num_rooms, check_out, check_in, check_in, check_out))
                
                available_rooms = cur.fetchone()[0]
                print("Available rooms : ", available_rooms, "\n---------------------------------------\n")
                return available_rooms >= num_rooms
        finally:
            conn.close()

    def create_booking(self, booking: BookingRequest) -> int:
        """Create a new booking in the database"""
        if not self.check_room_availability(
            booking.check_in_date, 
            booking.check_out_date,
            booking.room_type,
            booking.num_rooms
        ):
            raise ValueError("Requested rooms not available for these dates")

        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                # Get room ID and price
                cur.execute(
                    "SELECT RoomID, PricePerNight FROM Rooms WHERE RoomType = %s",
                    (booking.room_type,)
                )
                room = cur.fetchone()
                room_id = room[0]
                price = room[1]
                
                # Calculate total amount
                nights = (booking.check_out_date - booking.check_in_date).days
                total_amount = price * booking.num_rooms * nights
                
                # Insert booking
                cur.execute("""
                    INSERT INTO Bookings (
                        GuestName, Email, PhoneNumber, CheckInDate, CheckOutDate,
                        RoomID, NumRooms, NumGuests, TotalAmount
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING BookingID
                """, (
                    booking.guest_name, booking.email, booking.phone_number,
                    booking.check_in_date, booking.check_out_date, room_id,
                    booking.num_rooms, booking.num_guests, total_amount
                ))
                
                booking_id = cur.fetchone()[0]
                conn.commit()
                return booking_id
        finally:
            conn.close()

    def cancel_booking(self, booking_id: int) -> bool:
        """Cancel an existing booking"""
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "DELETE FROM Bookings WHERE BookingID = %s",
                    (booking_id,)
                )
                conn.commit()
                return cur.rowcount > 0
        finally:
            conn.close()

    def update_booking(self, update: BookingUpdate) -> bool:
        """Update an existing booking"""
        update_fields = []
        update_values = []
        
        if update.check_in_date:
            update_fields.append("CheckInDate = %s")
            update_values.append(update.check_in_date)
        if update.check_out_date:
            update_fields.append("CheckOutDate = %s")
            update_values.append(update.check_out_date)
        if update.num_guests:
            update_fields.append("NumGuests = %s")
            update_values.append(update.num_guests)
        if update.num_rooms:
            update_fields.append("NumRooms = %s")
            update_values.append(update.num_rooms)
            
        if not update_fields:
            return False
            
        update_values.append(update.booking_id)
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    f"UPDATE Bookings SET {', '.join(update_fields)} WHERE BookingID = %s",
                    tuple(update_values)
                )
                conn.commit()
                return cur.rowcount > 0
        finally:
            conn.close()

    def handle_conversation(self, user_input: str) -> str:
        """Main conversation handler"""
        try:
            # Process user input and generate appropriate response
            response = self.conversation_chain.predict(human_input=user_input)
            
            # Check for specific intents
            if "hotel information" in user_input.lower():
                hotel_info = self.get_hotel_info()
                response = f"{response}\n\n{hotel_info}"
            
            return response
        except Exception as e:
            return f"I apologize, but I encountered an error: {str(e)}"

# Example conversation flow
def main():
    chatbot = HotelChatbot(groq_api_key="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")
    
    # Example conversation
    print("Hotel Assistant: Hello! Welcome to our hotel. How may I assist you today?")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() in ['quit', 'exit', 'bye']:
            print("Hotel Assistant: Thank you for chatting with us. Have a great day!")
            break
            
        response = chatbot.handle_conversation(user_input)
        print(f"Hotel Assistant: {response}")

if __name__ == "__main__":
    main()