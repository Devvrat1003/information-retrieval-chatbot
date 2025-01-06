import { useState } from "react";
import "./index.css";
import ChatUI from "./components/chatUI";

function App() {
    const [count, setCount] = useState(0);
    const [chat, setChat] = useState([]);
    const [curr, setCurr] = useState("");
    const [question, setQuestion] = useState("");

    const getResult = async () => {
        const res = await fetch(
            "https://information-retrieval-chatbot.onrender.com/askLLM/" +
                // "http://127.0.0.1:8000/askLLM/" +
                question
        );

        let ans = await res.json();

        console.log(ans, "before");
        setChat([...chat, question, ans]);
        setCurr(ans);
        console.log(chat, " chat afters");
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-between px-96 py-4 gap-4">
            <ChatUI chat={chat} />
            <div className="flex gap-2 h-fit w-full">
                <input
                    className="outline-none border border-gray-500 p-2 rounded w-full"
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
                    className="w-28 p-2 border border-black rounded"
                >
                    Ask Groq
                </button>
            </div>
        </div>
    );
}

export default App;
