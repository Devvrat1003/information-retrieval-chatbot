import { useState } from "react";
import "./index.css";
import ChatUI from "./components/chatUI";
import Navbar from "./components/navbar";

function App() {
    const [chat, setChat] = useState([]);
    const [question, setQuestion] = useState("");

    const getResult = async () => {
        if (question === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }
        try {
            const res = await fetch(
                "https://information-retrieval-chatbot.onrender.com/askLLM/" +
                    question
            );

            let ans = await res.json();

            setChat([...chat, question, ans]);
        } catch (error) {
            console.log("error", error);
            return;
        }
    };

    return (
        <div className="w-screen h-screen px-96 py-4 flex flex-col justify-between bg-[#b0bd8c]">
            <div className="flex flex-col items-center justify-between gap-4">
                <Navbar></Navbar>
                <ChatUI chat={chat} />
            </div>
            <div className="flex gap-2 h-fit w-full">
                <input
                    className="outline-none border border-black p-2 rounded w-full font-mono bg-transparent "
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key == "Enter") getResult();
                    }}
                    onChange={(e) => {
                        setQuestion(e.target.value);
                    }}
                />

                <button
                    onClick={getResult}
                    className="w-28 p-2 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                >
                    Ask Groq
                </button>
            </div>
        </div>
    );
}

export default App;
