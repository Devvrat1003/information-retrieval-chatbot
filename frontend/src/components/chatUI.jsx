import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import { ThreeDots } from "react-loader-spinner";
import { CgAttachment } from "react-icons/cg";
import { showImageState } from "../atom/chatState";
import { useRecoilState } from "recoil";

export default function ChatUI(props) {
    const messages = props.messages;
    const loading = props.loading;
    const question = props.question;
    const chatContainerRef = useRef(null); // Ref for the chat container

    const images = props.images;
    const [showImage, setShowImage] = useRecoilState(showImageState);

    const showImages = () => {
        // console.log(images, "images");
        setShowImage(!showImage);
        // console.log(showImage, "showImage");
    };

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
                        <Markdown>{msg.content}</Markdown>
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
            {/* {images.length > 0 && ( */}
            {/* <CgAttachment
                size={30}
                className="absolute right-4 top-18 cursor-pointer border border-black bg-opacity-30 backdrop-blur-sm  rounded-full p-1"
                onClick={showImages}
            /> */}
            {/* )} */}
        </div>
    );
}
