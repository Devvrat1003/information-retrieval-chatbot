import React, { useState, useRef } from "react";
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
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognition = useRef(null);
    const [defaultQuestions, setDefaultQuestions] = useState([
        "What are the available hotels?",
        "Book a Hotels ?",
    ]);

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

    const handleDefaultQuestionClick = (defaultQuestion) => {
        setQuestion(defaultQuestion);
        setChats({ ...chats, question: defaultQuestion });
        setDefaultQuestions((prevQuestions) =>
            prevQuestions.filter((q) => q !== defaultQuestion)
        );
        getResult(defaultQuestion);
    };

    const getResult = async (customQuestion = question) => {
        if (customQuestion === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }

        try {
            setLoading(true);
            setChats({ ...chats, question: customQuestion });
            const res = await fetch(
                "https://information-retrieval-chatbot.onrender.com/askLLM",
                //"http://127.0.0.1:8000/askLLM",
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
            setLoading(false);
        } catch (error) {
            console.error("Error fetching result:", error);
            setLoading(false);
        }
    };

    return (
        <div
            className={`bg-gray-100 shadow-lg w-full max-w-sm mx-auto mt-8 rounded-lg overflow-hidden flex flex-col`} // Updated design
        >
            <Navbar />
            <div className="w-full bg-white h-[28rem] p-4 flex flex-col justify-between gap-4">
                <ChatUI
                    messages={chats.messages}
                    loading={loading}
                    question={question}
                    images={chats.images}
                />
                <div className="flex gap-2 w-full">
                    <input
                        placeholder="Type a message..."
                        className="outline-none border border-gray-300 p-3 rounded-lg w-full bg-gray-50 text-sm shadow-inner"
                        type="text"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                getResult();
                                setQuestion(e.target.value);
                                e.target.value = "";
                            }
                        }}
                        onChange={(e) => {
                            setQuestion(e.target.value);
                            setChats({ ...chats, question: e.target.value });
                        }}
                    />
                    <button
                        onClick={(e) => {
                            getResult();
                            e.target.previousElementSibling.value = "";
                        }}
                        className="bg-blue-500 text-white rounded-full p-3 hover:bg-blue-600 flex items-center justify-center shadow-lg"
                    >
                        <IoMdSend size={20} />
                    </button>
                    <button
                        onClick={startListening}
                        className={`p-3 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg ${
                            isListening
                                ? "bg-red-500"
                                : "bg-green-500 hover:bg-green-600"
                        } text-white`}
                    >
                        {isListening ? (
                            <BeatLoader size={8} color="white" />
                        ) : (
                            <FaMicrophone size={20} />
                        )}
                    </button>
                </div>
                <div className="w-full flex flex-col gap-2">
                    {defaultQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {defaultQuestions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDefaultQuestionClick(q)}
                                    className="bg-gray-200 text-gray-800 rounded-lg p-2 hover:bg-gray-300"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
