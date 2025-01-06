export default function ChatUI(props) {
    const chats = props.chat;
    return (
        <div className="flex flex-col w-full border gap-2 p-2 rounded overflow-y-scroll">
            {chats.map((msg, index) => {
                console.log("index", index);
                if (index % 2 == 0) {
                    return (
                        <div
                            className="w-fit max-w-[60%] bg-blue-300 p-2 rounded self-end"
                            key={index}
                        >
                            {msg}
                        </div>
                    );
                } else
                    return (
                        <div
                            className="w-fit max-w-[60%] self-start bg-green-300 p-2 rounded"
                            key={index}
                        >
                            {msg}
                        </div>
                    );
            })}
        </div>
    );
}
