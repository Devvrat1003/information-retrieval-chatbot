import { useEffect, useRef } from "react";
import MarkdownRenderer from "react-markdown-renderer";
import { ThreeDots } from "react-loader-spinner";
import { CgAttachment } from "react-icons/cg";
import { showImageState } from "../atom/chatState";
import { useRecoilState } from "recoil";
import UserDetailForm from "./userDetailForm";

export default function ChatUI(props) {
    const messages = props.messages;
    const loading = props.loading;
    const question = props.question;
    const chatContainerRef = useRef(null);

    const images = props.images;
    const [showImage, setShowImage] = useRecoilState(showImageState);

    const showImages = () => {
        setShowImage(!showImage);
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading, question]);

    return (
        <div
            ref={chatContainerRef}
            className="w-full font-sans overflow-y-scroll flex flex-col text-sm border border-gray-300 bg-white shadow-lg gap-3 p-4 rounded-b-lg flex-grow"
        >
            <UserDetailForm />
            {messages.map((msg, index) => (
                <div
                    className={`w-fit max-w-[75%] px-3 py-2 rounded-lg shadow-md ${
                        msg.type === "ai" ? "bg-purple-100 text-purple-900 self-start" : "bg-blue-100 text-blue-900 self-end"
                    }`}
                    key={index}
                >
                    <MarkdownRenderer markdown={msg.content} />
                </div>
            ))}
            {loading && (
                <div className="w-full flex flex-col items-end">
                    <p className="w-fit max-w-[75%] bg-blue-100 text-blue-900 px-3 py-2 rounded-lg shadow-md">
                        {question}
                    </p>
                    <ThreeDots
                        visible={true}
                        height="24"
                        width="24"
                        color="#5b21b6"
                        ariaLabel="loading"
                    />
                </div>
            )}
            {images.length > 0 && images[0][1].length > 0 && (
                <CgAttachment
                    size={28}
                    className="absolute right-4 top-16 cursor-pointer bg-gray-100 hover:bg-gray-200 p-1 rounded-full"
                    onClick={showImages}
                />
            )}
        </div>
    );
}
