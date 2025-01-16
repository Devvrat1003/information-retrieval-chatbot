import { IoMdClose } from "react-icons/io";
import { useRecoilValue, useRecoilState } from "recoil";
import { showChatState } from "../atom/chatState";
import { FaWindowMinimize } from "react-icons/fa6";

export default function Navbar() {
    const [showChat, setShowChat] = useRecoilState(showChatState);
    const toggleChat = () => {
        setShowChat(!showChat);
    };
    return (
        <div className="bg-black border border-black text-white w-full flex justify-between items-center p-2 px-3 rounded-t">
            <div className=" text-center border border-black text-lg font-medium font-serif rounded-t">
                Hotel Chatbot
            </div>
            <div className="flex items-center gap-2">
                <FaWindowMinimize
                    size={20}
                    onClick={toggleChat}
                    className="cursor-pointer h-fit p-1"
                />
                <IoMdClose size={20} className="cursor-pointer" />
            </div>
        </div>
    );
}
