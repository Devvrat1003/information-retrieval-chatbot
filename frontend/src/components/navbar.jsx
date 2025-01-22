import { IoMdClose } from "react-icons/io";
import { useRecoilValue, useRecoilState } from "recoil";
import { chatState, showChatState } from "../atom/chatState";
import { FaMinus } from "react-icons/fa";

export default function Navbar() {
    const [showChat, setShowChat] = useRecoilState(showChatState);
    const toggleChat = () => {
        setShowChat(!showChat);
    };

    const [chats, setChats] = useRecoilState(chatState);

    const newChat = () => {
        setChats({
            ...chats,
            messages: [
                {
                    content: "Hello, welcome to Swaroop  Vilas Hotel 🌟",
                    type: "ai",
                },
            ],
            question: "",
        });
    };

    return (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 border-b text-white w-full flex justify-between items-center p-3 rounded-t-lg shadow-md">
            <h1 className="text-lg font-semibold font-sans tracking-wide">Hotel Chatbot</h1>
            <div className="flex items-center gap-3">
                <FaMinus
                    size={18}
                    onClick={toggleChat}
                    className="cursor-pointer hover:scale-105"
                />
                <IoMdClose
                    size={20}
                    className="cursor-pointer hover:scale-105"
                    onClick={() => {
                        toggleChat();
                        newChat();
                    }}
                />
            </div>
        </div>
    );
}
