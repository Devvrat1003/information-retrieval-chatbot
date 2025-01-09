import { useEffect, useRef } from "react";

export default function ChatUI(props) {
    const messages = props.messages;
    const chatContainerRef = useRef(null); // Ref for the chat container

    // Scroll to the bottom whenever the messages array changes
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight;
        }
    }, [messages]); // Dependency on messages to trigger the effect when they change

    return (
        <div
            ref={chatContainerRef} // Attach the ref to the container
            className="overflow-y-scroll flex flex-col w-full border border-black gap-2 p-2 rounded flex-grow justify-start"
        >
            {messages.map((msg, index) => {
                return (
                    <div
                        className={`w-fit max-w-[60%] ${
                            index === 0 && "hidden"
                        } ${index % 2 === 1 && "bg-green-300 self-start"} ${
                            index % 2 === 0 && "bg-blue-300 self-end"
                        } px-2 py-1 rounded`}
                        key={index}
                    >
                        {msg.content}
                    </div>
                );
            })}
        </div>
    );
}
