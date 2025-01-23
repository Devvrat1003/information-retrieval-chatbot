import React, { useState, useRef, useEffect } from "react";
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
        
    ]);
    const [showForm, setShowForm] = useState(false);

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
        getResult(defaultQuestion);
    };

    const getResult = async (customQuestion = question) => {
        if (customQuestion === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }

        // Check if the message is asking to show the form
        if (customQuestion.toLowerCase().includes('show form')) {
            setShowForm(true);
            const formMessage = {
                type: 'ai',
                content: 'Here is the booking form for you.',
                timestamp: new Date().toISOString()
            };
            setChats(prev => ({
                ...prev,
                messages: [...prev.messages, formMessage]
            }));
            setLoading(false);
            setQuestion("");
            return;
        }

        try {
            setLoading(true);
            // Add user message with timestamp
            const userMessage = {
                type: 'user',
                content: customQuestion,
                timestamp: new Date().toISOString()
            };

            // Update messages with user's message
            setChats(prev => ({
                ...prev,
                messages: [...prev.messages, userMessage]
            }));

            // Make API call
            const res = await fetch(//"https://information-retrieval-chatbot.onrender.com/askLLM",
                "http://127.0.0.1:8000/askLLM",
                {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: customQuestion,
                    messages: [...chats.messages, userMessage] // Include the new message
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Backend response:", data); // Debug log

            // Create AI message
            const aiMessage = {
                type: 'ai',
                content: data.response || data.message || "Sorry, I couldn't process that request.",
                timestamp: new Date().toISOString()
            };

            // Update messages with AI response
            setChats(prev => ({
                ...prev,
                messages: [...prev.messages, aiMessage],
                images: data.images || []
            }));

            setLoading(false);
            setQuestion("");

        } catch (error) {
            console.error("Error fetching result:", error);
            const errorMessage = {
                type: 'ai',
                content: "Sorry, there was an error processing your request. Please try again.",
                timestamp: new Date().toISOString()
            };
            
            setChats(prev => ({
                ...prev,
                messages: [...prev.messages, errorMessage]
            }));
            
            setLoading(false);
            setQuestion("");
        }
    };

    useEffect(() => {
        // Add the handler to the window object
        window.handleDefaultQuestion = (question) => {
            handleDefaultQuestionClick(question);
        };

        // Cleanup
        return () => {
            delete window.handleDefaultQuestion;
        };
    }, [chats]); // Add chats to the dependency array

    return (
        <div className="border border-gray-100 shadow-xl self-end ml-auto rounded-lg text-sm flex flex-col justify-between items-center bg-white">
            <Navbar />
            <div className="w-[400px] bg-white h-[32rem] flex flex-col justify-between items-center gap-2 rounded-lg">
                <ChatUI
                    messages={chats.messages}
                    loading={loading}
                    question={question}
                    images={chats.images}
                    showForm={showForm}
                />
                <div className="flex gap-2 w-full px-4 py-3 border-t border-gray-50">
                    <input
                        placeholder="Type your message..."
                        className="outline-none border border-gray-200 px-4 py-2.5 rounded-full w-full font-sans bg-gray-50/50 focus:bg-white focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100 transition-all text-[15px]"
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
                        className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-700 flex items-center justify-center transition-all shadow-sm hover:shadow-indigo-100 hover:shadow-lg"
                    >
                        <IoMdSend size={20} />
                    </button>
                    <button
                        onClick={startListening}
                        className={`p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-lg ${
                            isListening
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100"
                        } text-white`}
                    >
                        {isListening ? (
                            <BeatLoader size={8} color="white" />
                        ) : (
                            <FaMicrophone size={20} />
                        )}
                    </button>
                </div>
                <div className="w-full px-4 pb-3">
                    {defaultQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {defaultQuestions.map((q, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDefaultQuestionClick(q)}
                                    className="bg-gray-50 text-gray-600 rounded-full px-4 py-1.5 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-gray-100 hover:border-indigo-100"
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
