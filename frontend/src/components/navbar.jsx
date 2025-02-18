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
                    content: `<div style="text-align: center;">
                        <img src="/logo.jpg" alt="Hotel Logo" style="width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 10px auto;" />
                        <h2>Welcome to Swaroop Vilas Hotel 🌟</h2>
                        <p style="font-style: italic; color: #666;">Experience Luxury, Create Memories</p>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 16px;">
                            <button 
                                onclick="window.handleDefaultQuestion('Check room availability?')" 
                                style="background-color: #f3f4f6; color: #4b5563; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.backgroundColor='#e5e7eb'"
                                onmouseout="this.style.backgroundColor='#f3f4f6'"
                            >
                                Check room availability?
                            </button>
                            <button 
                                onclick="window.handleDefaultQuestion('Book Hotel Room ?')"
                                style="background-color: #f3f4f6; color: #4b5563; padding: 8px 16px; border-radius: 9999px; font-size: 14px; border: 1px solid #e5e7eb; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.backgroundColor='#e5e7eb'"
                                onmouseout="this.style.backgroundColor='#f3f4f6'"
                            >
                                Book Hotel Room ?
                            </button>
                        </div>
                    </div>`,
                    type: "ai",
                    isWelcomeMessage: true,
                    timestamp: new Date().toISOString(),
                },
            ],
            question: "",
        });
    };

    return (
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white w-full flex justify-between items-center px-4 py-3.5 rounded-t-lg">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-medium overflow-hidden"> 
                    <img src="/logo.jpg" alt="logo" className="w-full h-full object-cover" />            
                </div>
                <h1 className="text-base font-semibold font-sans tracking-wide">Hotel Chatbot</h1>
            </div>
            <div className="flex items-center gap-4">
                <FaMinus
                    size={16}
                    onClick={toggleChat}
                    className="cursor-pointer hover:text-white/80 transition-colors"
                />
                <IoMdClose
                    size={18}
                    className="cursor-pointer hover:text-white/80 transition-colors"
                    onClick={() => {
                        toggleChat();
                        newChat();
                    }}
                />
            </div>
        </div>
    );
}
