import React from "react";
import { useState, useRef, useEffect, CSSProperties } from "react";
import "../index.css";
import ChatUI from "../components/chatUI";
import Navbar from "../components/navbar";
import Speech from "../components/speech";

export default function Chatbot() {
    const [messages, setMessages] = useState([]);
    const [question, setQuestion] = useState("");

    // const [item, setItem] = useState({
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

    const [item, setItem] = useState({
        messages: [],
        question: "",
        images: [],
    });

    let [loading, setLoading] = useState(false);

    const getResult = async () => {
        if (item.question === "") {
            alert("Uh Oh! You forgot to ask a question");
            return;
        }
        try {
            setLoading(true);
            setItem({ ...item, question: question });
            // console.log(messages, "before");
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
            setItem({ ...item, messages: ans.messages, images: ans.images });
            console.log(ans, "ans");
            setLoading(false);
        } catch (error) {
            // console.log("error", error);
            return;
        }
    };

    const newChat = () => {
        setItem({ messages: [], question: "" });
    };

    return (
        <div className="w-screen h-screen px-[5%] text-sm sm:text-base sm:px-[15%] lg:px-[20%] py-4 flex flex-col justify-between items-center gap-4">
            {/* <div className="h-full flex flex-col flex-grow items-center justify-between gap-4"> */}
            <Navbar></Navbar>
            <ChatUI
                messages={item.messages}
                loading={loading}
                question={question}
                images={item.images}
            />
            {/* <div>
                {item.images[1].map((url, index) => {
                    return <img src={url} alt="Image urls" />;
                })}
            </div> */}

            <div className="flex gap-2  w-full">
                <input
                    className="outline-none border border-black p-2 rounded w-full font-mono bg-transparent "
                    type="text"
                    onKeyDown={(e) => {
                        if (e.key == "Enter") {
                            getResult();
                            setQuestion(e.target.value);
                            e.target.value = "";
                            // this.value = "";
                        }
                    }}
                    onChange={(e) => {
                        // setQuestion(e.target.value);
                        setQuestion(e.target.value);
                        setItem({ ...item, question: e.target.value });
                    }}
                />

                <button
                    onClick={(e) => {
                        getResult();
                        e.target.previousElementSibling.value = "";
                    }}
                    className="w-28 p-1 lg:p-2 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                >
                    Ask Groq
                </button>
                <button
                    onClick={newChat}
                    className="w-28 p-1 lg:p-2 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                >
                    New Chat
                </button>
            </div>
            {/* </div> */}
        </div>
    );
}
