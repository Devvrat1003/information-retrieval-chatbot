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
                content: "Hello, welcome to Swaroop Vilas Hotel",
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
