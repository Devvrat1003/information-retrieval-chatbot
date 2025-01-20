import React from "react";
import { useState, useRef } from "react";
import "../chatbotUI.css";
import ChatUI from "./chatUI";
import Navbar from "./navbar";
import { IoMdSend } from "react-icons/io";
import { useRecoilState } from "recoil";
import { FaMicrophone } from "react-icons/fa";
import { chatState } from "../atom/chatState";
import BeatLoader from "react-spinners/BeatLoader";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");

    const [chats, setChats] = useRecoilState(chatState);

    let [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef(null);

    // Initialize Speech Recognition
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        recognition.current = new (window.SpeechRecognition ||
            window.webkitSpeechRecognition)();
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
                // getResult();
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
                // "https://information-retrieval-chatbot.onrender.com/askLLM",
                "http://127.0.0.1:8000/askLLM",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(chats),
                }
            );
            let ans = await res.json();

            if (ans.images && ans.images.length > 0)
                setChats({
                    ...chats,
                    messages: ans.messages,
                    images: ans.images,
                });
            else {
                setChats({ ...chats, messages: ans.messages });
            }
            console.log(ans, "ans");
            console.log(chats, "chats");
            setLoading(false);
        } catch (error) {
            // console.log("error", error);
            return;
        }
    };

    return (
        <div
            className={`border border-black self-end ml-auto rounded text-sm flex flex-col justify-between items-center`}
        >
            <Navbar></Navbar>
            <div className="w-96 bg-white h-[28rem] p-2 flex flex-col justify-between items-center gap-2 rounded">
                <ChatUI
                    messages={chats.messages}
                    loading={loading}
                    question={question}
                    images={chats.images}
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
                        className={`w-fit p-2 border border-black rounded flex items-center gap-1 ${
                            isListening
                                ? "bg-[#f0a500]"
                                : "hover:bg-[#b0bd7c] px-4"
                        } font-serif`}
                    >
                        {isListening ? (
                            <BeatLoader size={6} speedMultiplier={0.5} />
                        ) : (
                            <FaMicrophone />
                        )}
                    </button>
                    {/* </div> */}
                </div>
            </div>
            {/* </div> */}
        </div>
    );
}
