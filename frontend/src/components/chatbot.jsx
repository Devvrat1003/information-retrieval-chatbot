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
    const audioRef = useRef(new Audio());
    const [autoPlayAudio, setAutoPlayAudio] = useState(true);

    // Separate refs for different sounds
    const sendSoundRef = useRef(new Audio('/sounds/send-message.mp3'));
    const receiveSoundRef = useRef(new Audio('/sounds/send-message.mp3'));
    const [isReceiveSoundMuted, setIsReceiveSoundMuted] = useState(false);

    // Separate functions for send and receive sounds
    const playSendSound = () => {
        sendSoundRef.current.currentTime = 0;
        sendSoundRef.current.volume = 0.5;
        sendSoundRef.current.play().catch(e => {
            console.error("Send sound effect error:", e);
        });
    };

    const playReceiveSound = () => {
        if (!isReceiveSoundMuted) {
            receiveSoundRef.current.currentTime = 0;
            receiveSoundRef.current.volume = 0.5;
            receiveSoundRef.current.play().catch(e => {
                console.error("Receive sound effect error:", e);
            });
        }
    };

    // Update the mute toggle to only affect receive sound
    const toggleSound = () => {
        setIsReceiveSoundMuted(!isReceiveSoundMuted);
    };

    // Enhanced speech recognition setup
    useEffect(() => {
        if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
            recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            recognition.current.continuous = false;
            recognition.current.interimResults = false;
            recognition.current.lang = "en-US";

            // Add error handling for initialization
            recognition.current.onerror = (event) => {
                console.error("Speech recognition error:", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed') {
                    alert("Please enable microphone permissions for speech recognition to work.");
                }
            };
        } else {
            console.error("Speech recognition not supported in this browser");
        }
    }, []);

    const startListening = () => {
        if (recognition.current) {
            try {
                recognition.current.start();
                setIsListening(true);

                recognition.current.onresult = (event) => {
                    const transcript = event.results[0][0].transcript;
                    console.log("Recognized text:", transcript); // Debug log
                    setQuestion(transcript);
                    setChats({ ...chats, question: transcript });
                    recognition.current.stop();
                    setIsListening(false);
                };

                recognition.current.onend = () => {
                    console.log("Speech recognition ended"); // Debug log
                    setIsListening(false);
                };

            } catch (error) {
                console.error("Speech recognition error:", error);
                setIsListening(false);
                alert("Error starting speech recognition. Please try again.");
            }
        } else {
            alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
        }
    };

    const handleDefaultQuestionClick = (defaultQuestion) => {
        setQuestion(defaultQuestion);
        setChats({ ...chats, question: defaultQuestion });
        getResult(defaultQuestion);
    };

    const playAudioResponse = (audioBase64) => {
        if (!autoPlayAudio) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            return;
        }

        // If there's a previous audio playing, stop it
        if (audioRef.current.src) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        
        const audioSrc = `data:audio/mp3;base64,${audioBase64}`;
        audioRef.current.src = audioSrc;
        
        // Add event listener for when audio ends
        audioRef.current.onended = () => {
            audioRef.current.currentTime = 0; // Reset for next play
        };

        audioRef.current.play().catch(e => console.error("Audio playback error:", e));
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
            playSendSound(); // This will always play

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
            const res = await fetch("https://information-retrieval-chatbot.onrender.com/askLLM",
                //"http://127.0.0.1:8000/askLLM",
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

            // Play receive sound before AI response
            playReceiveSound();

            // Handle audio response
            if (data.audio) {
                setTimeout(() => {
                    playAudioResponse(data.audio);
                }, 500); // Small delay after receive sound
            }

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
            playReceiveSound(); // Even play sound for error messages
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

    // Update audio mute toggle
    const toggleAudio = () => {
        setAutoPlayAudio(!autoPlayAudio);
        // If unmuting, reset audio refs
        if (!autoPlayAudio) {
            audioRef.current.currentTime = 0;
            sendSoundRef.current.currentTime = 0;
            receiveSoundRef.current.currentTime = 0;
        } else {
            // If muting, pause any playing audio
            audioRef.current.pause();
            sendSoundRef.current.pause();
            receiveSoundRef.current.pause();
        }
    };

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
                        onClick={() => getResult()}
                        className="bg-indigo-600 text-white rounded-full p-2.5 hover:bg-indigo-700 flex items-center justify-center transition-all shadow-sm hover:shadow-indigo-100 hover:shadow-lg"
                    >
                        <IoMdSend size={20} />
                    </button>
                    <button
                        onClick={toggleAudio}
                        className={`p-2.5 rounded-full ${
                            autoPlayAudio ? 'bg-indigo-600' : 'bg-gray-400'
                        } text-white hover:shadow-lg transition-all`}
                        title={autoPlayAudio ? 'Disable voice responses' : 'Enable voice responses'}
                    >
                        {autoPlayAudio ? '🔊' : '🔇'}
                    </button>
                    <button
                        onClick={startListening}
                        className={`p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-lg ${
                            isListening
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100"
                        } text-white relative`}
                        disabled={loading}
                    >
                        {isListening ? (
                            <>
                                <BeatLoader size={8} color="white" />
                                <span className="absolute -top-8 whitespace-nowrap text-xs bg-black text-white px-2 py-1 rounded">
                                    Listening...
                                </span>
                            </>
                        ) : (
                            <FaMicrophone size={20} />
                        )}
                    </button>
                    <button
                        onClick={toggleSound}
                        className="sound-toggle-btn"
                    >
                        {isReceiveSoundMuted ? (
                            <i className="fas fa-volume-mute"></i>
                        ) : (
                            <i className="fas fa-volume-up"></i>
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
