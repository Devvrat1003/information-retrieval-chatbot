import React from "react";
import { useState, useRef, useEffect, CSSProperties } from "react";
import "../chatbotUI.css";
import ChatUI from "./chatUI";
import Navbar from "./navbar";
import { IoMdSend } from "react-icons/io";
import { useRecoilState } from "recoil";
import { showChatState } from "../atom/chatState";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { FaMicrophone } from "react-icons/fa";
import { chatState } from "../atom/chatState";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");

    const [chats, setChats] = useRecoilState(chatState);

    let [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef(null);

    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window) {
        recognition.current = new window.webkitSpeechRecognition();
        recognition.current.continuous = false;
        recognition.current.interimResults = false;
        recognition.current.lang = "en-US";
    }

    const startListening = () => {
        if (recognition.current) {
            recognition.current.start();
            setIsListening(true);

            recognition.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuestion(transcript);
                setChats({ ...chats, question: transcript });
                recognition.current.stop();
                getResult();
                setIsListening(false);
            };

            recognition.current.onerror = () => {
                recognition.current.stop();

                setIsListening(false);
                alert("Error with speech recognition. Please try again.");
            };

            recognition.current.onend = () => {
                setIsListening(false);
            };
        } else {
            alert("Your browser does not support speech recognition.");
        }
    };

    const getResult = async () => {
        if (chats.question === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }
        try {
            setLoading(true);
            setChats({ ...chats, question: question });
            const res = await fetch(
                "https://information-retrieval-chatbot.onrender.com/askLLM",
                // "http://127.0.0.1:8000/askLLM",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(chats),
                }
            );
            let ans = await res.json();
            // setMessages([...messages, question, ans.response]);
            // setMessages(ans.messages);
            setChats({ ...chats, messages: ans.messages, images: ans.images });
            console.log(ans, "ans");
            setLoading(false);
        } catch (error) {
            // console.log("error", error);
            return;
        }
    };

    return (
        <div
            className={`border border-black self-end ml-auto bg-white rounded text-sm flex flex-col justify-between items-center`}
        >
            <Navbar></Navbar>
            <div className="w-80 h-[28rem] p-2 flex flex-col justify-between items-center gap-2 rounded">
                <ChatUI
                    messages={chats}
                    loading={loading}
                    question={question}
                    images={chats}
                />
                {/* <div>
                {chats.images[1].map((url, index) => {
                    return <img src={url} alt="Image urls" />;
                })}
            </div> */}

                <div className="flex gap-2  w-full">
                    <input
                        placeholder="Message..."
                        className="outline-none border border-black p-2 rounded w-full font-mono bg-transparent "
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key == "Enter") {
                                getResult();
                                setQuestion(e.target.value);
                                e.target.value = "";
                            }
                        }}
                        onChange={(e) => {
                            // setQuestion(e.target.value);
                            setQuestion(e.target.value);
                            setChats({ ...chats, question: e.target.value });
                        }}
                    />

                    <button
                        onClick={(e) => {
                            getResult();
                            e.target.previousElementSibling.value = "";
                        }}
                        className="w-fit p-1 justify-center border border-black rounded hover:bg-[#b0bd7c] font-serif flex items-center gap-2"
                    >
                        Send
                        <IoMdSend />
                    </button>
                    {/* <button
                            onClick={() => {
                                newChat();
                                console.log(chats, "chats");
                            }}
                            className="w-1/2 p-1 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                        >
                            New Chat
                        </button> */}
                    <button
                        onClick={startListening}
                        className={`w-28 p-1 border border-black rounded flex items-center gap-1 ${
                            isListening ? "bg-[#f0a500]" : "hover:bg-[#b0bd7c]"
                        } font-serif`}
                    >
                        {isListening ? "Listening..." : " Speak"}
                        {isListening ? null : <FaMicrophone />}
                    </button>
                    {/* </div> */}
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}
// const [chats, setChats] = useState({
//     messages: [
//         { content: "The year is 2025." },
//         { content: "Hello, welcome to Swaroop Vilas Hotel" },
//         { content: "show me images of some rooms" },
//         {
//             content:
//                 "We have a variety of rooms to choose from. Here are some images of our rooms: 1. **Deluxe Room**: Queen-sized bed, en-suite bathroom, city view [https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=](https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=) 2. **Suite**: King-sized bed, living area, premium amenities [https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg](https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg)3. **Standard Room**: Cozy room with essential amenities [https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=](https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=)4. **Family Room**: Two queen beds, perfect for families [https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=](https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=)5. **Penthouse**: Luxury suite with panoramic city views [https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg](https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg)Which type of room would you like to book?",
//         },
//     ],
//     question: "",
//     images: [
//         3,
//         [
//             "https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=",
//             "https://media.istockphoto.com/id/1050564510/photo/3d-rendering-beautiful-luxury-bedroom-suite-in-hotel-with-tv.jpg?s=612x612&w=0&k=20&c=ZYEso7dgPl889aYddhY2Fj3GOyuwqliHkbbT8pjl_iM=",
//             "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg",
//             "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?cs=srgb&dl=pexels-pixabay-271618.jpg&fm=jpg",
//             "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
//             "https://media.istockphoto.com/id/627892060/photo/hotel-room-suite-with-view.jpg?s=612x612&w=0&k=20&c=YBwxnGH3MkOLLpBKCvWAD8F__T-ypznRUJ_N13Zb1cU=",
//             "https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=",
//             "https://media.istockphoto.com/id/1370825295/photo/modern-hotel-room-with-double-bed-night-tables-tv-set-and-cityscape-from-the-window.jpg?s=612x612&w=0&k=20&c=QMXz9HJVhU-8MtBYyeJxtqLz90j7r0SrR6FTWniPkgc=",
//             "https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg",
//             "https://t3.ftcdn.net/jpg/06/19/00/08/360_F_619000872_AxiwLsfQqRHMkNxAbN4l5wg1MsPgBsmo.jpg",
//         ],
//     ],
// });
