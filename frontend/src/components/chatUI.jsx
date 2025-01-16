import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ThreeDots } from "react-loader-spinner";

export default function ChatUI(props) {
    const messages = props.messages.messages;
    const loading = props.loading;
    const question = props.question;
    const chatContainerRef = useRef(null); // Ref for the chat container

    const [images, setImages] = useState([]); // Initialize images as an empty array
    const [showImage, setShowImage] = useState(false);

    // UseEffect to handle image extraction when messages change
    // useEffect(() => {
    //     // Function to extract image URLs
    //     function extractImageURL(text) {
    //         const urlPattern = /https?:\/\/[\w./?=&%-]+/g;
    //         // const urlPattern = /(\d+)\. ([\w\s]+) - (https?:\/\/[^\s]+)/g;

    //         const urls = text.match(urlPattern);
    //         return urls || null;
    //     }

    //     // Extract image URLs from all message contents
    //     const newImages = messages
    //         .map((msg) => extractImageURL(msg.content))
    //         .filter((url) => url != null);

    //     // Set the images state
    //     setImages(newImages.flat());
    // }, [messages]); // Dependency on messages to trigger the effect when they change

    // Scroll to the bottom whenever the messages array changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading, question]); // Dependency on messages to trigger the effect when they change

    return (
        <div
            ref={chatContainerRef} // Attach the ref to the container
            className="w-full overflow-y-scroll flex flex-col border border-black gap-2 p-2 rounded flex-grow justify-start"
        >
            {messages.map((msg, index) => {
                return (
                    <div
                        className={`w-fit max-w-[80%] px-2 py-1 rounded text-[13px] ${
                            index === 0 && msg.type === "human" && "hidden"
                        } ${msg.type === "ai" && "bg-[#5ebf2e] self-start"} ${
                            msg.type === "human" && "bg-[#35bae6] self-end"
                        } `}
                        key={index}
                    >
                        {/* {images.length > 0 &&
                        images.some((url) => msg.content.includes(url)) ? (
                            <button
                                className="w-28 p-2 border border-black rounded hover:bg-[#b0bd7c] font-serif"
                                onClick={() => {
                                    setShowImage(!showImage);
                                }}
                            >
                                See Images
                            </button>
                        ) : ( */}
                        <div className="break-normal">{msg.content}</div>
                        {/* <Markdown>{msg.content}</Markdown> */}
                        {/* )} */}
                    </div>
                );
            })}
            {loading ? (
                <div className="w-full flex flex-col">
                    <p className="w-fit max-w-[80%] bg-[#35bae6] self-end px-2 py-1 rounded">
                        {question}
                    </p>
                    <ThreeDots
                        visible={true}
                        height="30"
                        width="30"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                    />
                </div>
            ) : null}
            {/* {showImage && images.length > 0 && (
                <div className="flex backdrop:blur-sm gap-2 bg-green-300 p-2 w-max rounded">
                    {images.map((url, index) => {
                        if (index % 2 === 0) {
                            return (
                                <img
                                    key={index}
                                    className="h-28"
                                    src={url}
                                    alt="Image urls"
                                />
                            );
                        }
                    })}
                </div> */}
            {/* )} */}
        </div>
    );
}
