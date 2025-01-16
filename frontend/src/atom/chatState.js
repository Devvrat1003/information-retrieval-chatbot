import { atom } from "recoil";

// Create an atom
export const showChatState = atom({
    key: "showChatState", // Unique ID for the atom
    default: false, // Default value
});

export const chats = atom({
    key: "chats",
    default: {
        messages: [
            { content: "Hello, welcome to Swaroop Vilas Hotel", type: "ai" },
        ],
        question: "",
        images: [],
        response: "Hello, welcome to Swaroop Vilas Hotel",
    },
});
