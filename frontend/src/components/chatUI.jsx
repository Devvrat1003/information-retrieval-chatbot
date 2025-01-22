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

    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
        });
    };

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, loading, question]);

    return (
        <div
            ref={chatContainerRef}
            className="w-full font-sans overflow-y-scroll flex flex-col text-sm bg-white shadow-none gap-4 p-4 rounded-lg flex-grow"
            style={{ 
                maxHeight: "calc(100vh - 180px)",
                scrollBehavior: "smooth"
            }}
        >
            <UserDetailForm showForm={props.showForm} />
            {messages.map((msg, index) => (
                <div key={index} className="flex flex-col">
                    <div
                        className={`w-fit max-w-[80%] px-5 py-3 rounded-2xl shadow-sm transition-all duration-300 ${
                            msg.type === "ai" 
                                ? "bg-gray-100 text-gray-800 self-start rounded-bl-none transform hover:-translate-y-0.5" 
                                : "bg-blue-500 text-white self-end rounded-br-none transform hover:-translate-y-0.5"
                        } ${loading && index === messages.length - 1 ? "opacity-90" : ""}`}
                    >
                        {msg.isWelcomeMessage ? (
                            <div dangerouslySetInnerHTML={{ __html: msg.content }} />
                        ) : (
                            <MarkdownRenderer 
                                markdown={msg.content}
                                className="prose prose-sm max-w-none break-words"
                                options={{
                                    overrides: {
                                        h1: { props: { className: 'text-lg font-bold mb-2' }},
                                        h2: { props: { className: 'text-base font-semibold mb-2' }},
                                        p: { props: { className: 'mb-1 leading-relaxed' }},
                                        ul: { props: { className: 'list-disc ml-4 mb-2 space-y-1' }},
                                        li: { props: { className: 'mb-1' }}
                                    }
                                }}
                            />
                        )}
                    </div>
                    {msg.timestamp && !msg.isWelcomeMessage && (
                        <span className={`text-xs text-gray-500 mt-1 ${
                            msg.type === "ai" ? "self-start ml-2" : "self-end mr-2"
                        }`}>
                            {formatTimestamp(msg.timestamp)}
                        </span>
                    )}
                </div>
            ))}
            {loading && (
                <div className="w-full flex flex-col items-end space-y-3">
                    <p className="w-fit max-w-[75%] bg-blue-500 text-white px-5 py-3 rounded-2xl shadow-sm">
                        {question}
                    </p>
                    <div className="mr-3">
                        <ThreeDots
                            visible={true}
                            height="30"
                            width="30"
                            color="#3b82f6"
                            ariaLabel="loading"
                            wrapperClass="opacity-75"
                        />
                    </div>
                </div>
            )}
            {images?.length > 0 && images[0][1]?.length > 0 && (
                <button
                    onClick={showImages}
                    className="absolute right-4 top-16 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 transform hover:scale-105"
                    aria-label="Show images"
                >
                    <CgAttachment size={22} className="text-gray-600" />
                </button>
            )}
        </div>
    );
}
