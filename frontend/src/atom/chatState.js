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
                    <h2>Welcome to Swaroop Vilas Hotel 🌟</h2>
                    <p style="font-style: italic; color: #666;">Experience Luxury, Create Memories</p>
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
