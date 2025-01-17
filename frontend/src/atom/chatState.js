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
                content:
                    "We have five types of rooms available at our hotel. Here are the descriptions for each:### Deluxe Room Queen-sized bed, en-suite bathroom, city view ### Suite King-sized bed, living area, premium amenities ### Standard Room Cozy room with essential amenities ### Family Room Two queen beds, perfect for families ### Penthouse Luxury suite with panoramic city views Which one of these rooms interests you the most?",
                type: "ai",
            },
        ],
        question: "",
        images: [],
        response: "Hello, welcome to Swaroop Vilas Hotel",
    },
});

export const showImageState = atom({
    key: "showImageState",
    default: false,
});
