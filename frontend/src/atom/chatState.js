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
            { content: "Hello, welcome to Swaroop Vilas Hotel", type: "ai" },
        ],
        question: "",
        images: [
            ["Deluxe", "https://shorturl.at/pb8RU"],
            ["Suite", "https://shorturl.at/FlwQe"],
            ["Standard Room", "https://shorturl.at/qzpoS"],
            ["Family Room", "https://shorturl.at/5IAme"],
            ["Penthouse", "https://shorturl.at/eH9Yu"],
        ],
        response: "Hello, welcome to Swaroop Vilas Hotel",
    },
});

export const showImageState = atom({
    key: "showImageState",
    default: false,
});
