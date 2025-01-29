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
    const [defaultQuestions, setDefaultQuestions] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const audioRef = useRef(new Audio());
    const [autoPlayAudio, setAutoPlayAudio] = useState(false);

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

    // Enhanced speech recognition setup with better device support
    useEffect(() => {
        const setupSpeechRecognition = () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                console.error("Speech recognition not supported");
                return;
            }

            try {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                recognition.current = new SpeechRecognition();

                // Set to false to stop after each message
                recognition.current.continuous = false;
                recognition.current.interimResults = true;
                recognition.current.lang = 'en-US';

                recognition.current.onstart = () => {
                    console.log("Speech recognition started");
                    setIsListening(true);
                };

                recognition.current.onend = () => {
                    console.log("Speech recognition ended");
                    setIsListening(false);
                };

                recognition.current.onresult = (event) => {
                    let finalTranscript = '';
                    let interimTranscript = '';

                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        const transcript = event.results[i][0].transcript;
                        if (event.results[i].isFinal) {
                            finalTranscript += transcript;
                            // Update question when we have final result
                            setQuestion(finalTranscript);
                            setChats(prev => ({ ...prev, question: finalTranscript }));
                            
                            // Send message and stop listening
                            if (finalTranscript.trim()) {
                                getResult(finalTranscript.trim());
                                stopListening();
                            }
                        } else {
                            interimTranscript += transcript;
                            setQuestion(interimTranscript);
                        }
                    }
                };

                recognition.current.onerror = (event) => {
                    console.error("Speech recognition error:", event.error);
                    setIsListening(false);
                    stopListening();

                    const errorMessages = {
                        'not-allowed': "Microphone access denied. Please enable microphone permissions.",
                        'audio-capture': "No microphone detected. Please check your microphone connection.",
                        'network': "Network error. Please check your internet connection.",
                        'no-speech': "No speech detected. Please try speaking again.",
                        'service-not-allowed': "Speech recognition service is not allowed.",
                        'bad-grammar': "Speech recognition grammar error.",
                        'language-not-supported': "Selected language is not supported.",
                        'aborted': "Speech recognition was aborted."
                    };

                    alert(errorMessages[event.error] || "Speech recognition error. Please try again.");
                };

            } catch (error) {
                console.error("Error setting up speech recognition:", error);
            }
        };

        setupSpeechRecognition();

        return () => {
            stopListening();
        };
    }, []);

    // Add stopListening function
    const stopListening = () => {
        if (recognition.current) {
            recognition.current.stop();
            setIsListening(false);
        }
    };

    // Enhanced startListening function
    const startListening = async () => {
        if (!recognition.current) {
            alert("Speech recognition is not supported in your browser. Please use Chrome or Safari.");
            return;
        }

        try {
            // If already listening, stop it
            if (isListening) {
                stopListening();
                return;
            }

            // Request microphone permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Clean up stream

            // Start new recognition
            recognition.current.start();
            setIsListening(true);

        } catch (error) {
            console.error("Microphone permission error:", error);
            if (error.name === 'NotAllowedError') {
                alert("Please enable microphone access in your browser settings to use voice input.");
            } else if (error.name === 'NotFoundError') {
                alert("No microphone found. Please check your microphone connection.");
            } else {
                alert("Error accessing microphone. Please try again.");
            }
            setIsListening(false);
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
        if (customQuestion.trim() === "") {
            alert("Please enter a message");
            return;
        }

        // Stop listening if active
        if (isListening) {
            stopListening();
        }

        try {
            setLoading(true);
            playSendSound();

            const userMessage = {
                type: 'user',
                content: customQuestion,
                timestamp: new Date().toISOString()
            };

            // Update messages in a single state update
            const newMessages = [...chats.messages, userMessage];
            
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
                    messages: newMessages
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            if (data.audio) {
                playReceiveSound();
                setTimeout(() => {
                    playAudioResponse(data.audio);
                }, 500);
            }

            const aiMessage = {
                type: 'ai',
                content: data.response || data.message || "Sorry, I couldn't process that request.",
                timestamp: new Date().toISOString()
            };

            // Single state update for both messages
            setChats(prev => ({
                ...prev,
                messages: [...newMessages, aiMessage],
                images: data.images || []
            }));

        } catch (error) {
            console.error("Error:", error);
            const errorMessage = {
                type: 'ai',
                content: "Sorry, there was an error processing your request. Please try again.",
                timestamp: new Date().toISOString()
            };
            
            setChats(prev => ({
                ...prev,
                messages: [...prev.messages, errorMessage]
            }));
        } finally {
            setLoading(false);
            setQuestion("");
            stopListening(); // Ensure listening is stopped
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

    // Add visual feedback component for voice recognition
    const VoiceRecognitionStatus = () => (
        isListening && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening...
            </div>
        )
    );

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
                        onClick={startListening}
                        className={`p-2.5 rounded-full flex items-center justify-center transition-all shadow-sm hover:shadow-lg relative ${
                            isListening
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-100"
                        } text-white`}
                        disabled={loading}
                    >
                        <FaMicrophone size={20} />
                        <VoiceRecognitionStatus />
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
