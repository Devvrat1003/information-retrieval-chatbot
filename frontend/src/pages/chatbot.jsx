import React from "react";
import { useState, useRef, useEffect } from "react";
import "../index.css";
import ChatUI from "../components/chatUI";
import Navbar from "../components/navbar";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");

    const [first, setFirst] = useState(false);

    const [item, setItem] = useState({ messages: [], question: "" });

    const getResult = async () => {
        if (item.question === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }
        try {
            setItem({ ...item, question: question });
            console.log(messages, "before");
            const res = await fetch(
                // "https://information-retrieval-chatbot.onrender.com/askLLM",
                "http://127.0.0.1:8000/askLLM",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                }
            );
            let ans = await res.json();
            // setMessages([...messages, question, ans.response]);
            // setMessages(ans.messages);
            setItem({ ...item, messages: ans.messages });

            React.render(<Speech text="Welcome to react speech" />);

            console.log(ans);
        } catch (error) {
            console.log("error", error);
            return;
        }
    };

    return (
        <div className="w-screen h-screen px-96 py-4 flex flex-col justify-between items-center gap-4">
            {/* <div className="h-full flex flex-col flex-grow items-center justify-between gap-4"> */}
            <Navbar></Navbar>
            <ChatUI messages={item.messages} />
            {/* <div
                ref={chatContainerRef}
                className="overflow-y-scroll flex flex-col w-full border border-black gap-2 p-2 rounded flex-grow justify-start"
            >
                {item.messages.map((msg, index) => {
                    return (
                        <div
                            className={`w-fit max-w-[60%] ${
                                index === 0 && "hidden"
                            } ${index % 2 === 0 && "bg-green-300 self-start"} ${
                                index % 2 === 1 && "bg-blue-300 self-end"
                            } px-2 py-1 rounded`}
                            key={index}
                        >
                            {msg.content}
                        </div>
                    );
                })}
            </div> */}
            <div className="flex gap-2  w-full">
                <input
                    className="outline-none border border-black p-2 rounded w-full font-mono bg-transparent "
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            getResult();
                            e.target.value = "";
                            // this.value = "";
                        }
                    }}
                    onChange={(e) => {
                        // setQuestion(e.target.value);
                        setItem({ ...item, question: e.target.value });
                    }}
                />

                <button
                    onClick={(e) => {
                        getResult();
                        e.target.previousElementSibling.value = "";
                    }}
                    className="w-28 p-2 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                >
                    Ask Groq
                </button>
            </div>
            {/* </div> */}
        </div>
    );
}
