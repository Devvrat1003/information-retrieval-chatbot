import { atom } from "recoil";

// Create an atom
export const showChatState = atom({
    key: "showChatState", // Unique ID for the atom
    default: false, // Default value
});

export const chatState = atom({
    key: "chatState",
    default: {
        messages: [
            {
                content: `<div style="text-align: center;">
                    <img src="/logo.jpg" alt="Hotel Logo" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 10px auto;" />
                    <h2>Welcome to Swaroop vilas Hotel 🌟</h2>
                    <p style="font-style: italic; color: #666;">Experience Luxury, Create Memories</p>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px;">
                        <button 
                            onclick="window.handleDefaultQuestion('Check room availability?')" 
                            style="background-color: #f3f4f6; color: #4F46E5; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.backgroundColor='#e5e7eb'"
                            onmouseout="this.style.backgroundColor='#f3f4f6'"
                        >
                            Check room availability?
                        </button>
                        <button 
                            onclick="window.handleDefaultQuestion('Book Hotel Room ')"
                            style="background-color: #f3f4f6; color:  #4F46E5; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.backgroundColor='#e5e7eb'"
                            onmouseout="this.style.backgroundColor='#f3f4f6'"
                        >
                            Book Hotel Room ?
                        </button>
                        <button 
                            onclick="window.handleDefaultQuestion('What are your room types and rates?')"
                            style="background-color: #f3f4f6; color:  #4F46E5; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.backgroundColor='#e5e7eb'"
                            onmouseout="this.style.backgroundColor='#f3f4f6'"
                        >
                            Room Types & Rates
                        </button>
                        <button 
                            onclick="window.handleDefaultQuestion('What amenities do you offer?')"
                            style="background-color: #f3f4f6; color:  #4F46E5; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.backgroundColor='#e5e7eb'"
                            onmouseout="this.style.backgroundColor='#f3f4f6'"
                        >
                            Hotel Amenities
                        </button>
                        <button 
                            onclick="window.handleDefaultQuestion('What are your check-in and check-out times?')"
                            style="background-color: #f3f4f6; color:  #4F46E5; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                            onmouseover="this.style.backgroundColor='#e5e7eb'"
                            onmouseout="this.style.backgroundColor='#f3f4f6'"
                        >
                            Check-in/out Times
                        </button>
                    </div>
                </div>`,
                type: "ai",
                isWelcomeMessage: true,
                timestamp: new Date().toISOString(),
            },
        ],
        question: "",
        images: [],
        response: "Welcome to Swaroop Vilas Hotel",
    },
});

export const showImageState = atom({
    key: "showImageState",
    default: false,
});
