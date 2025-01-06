export default function ChatUI(props) {
    const chats = props.chat;
    return (
        <div className="flex flex-col w-full border border-black gap-2 p-2 rounded overflow-y-scroll">
            {chats.map((msg, index) => {
                return (
                    <div
                        className={`w-fit max-w-[60%] ${
                            index % 2 == 0 && "bg-blue-300 self-end"
                        } ${
                            index % 2 == 1 && "bg-green-300 self-start"
                        } px-2 py-1 rounded`}
                        key={index}
                    >
                        {msg}
                    </div>
                );
            })}
        </div>
    );
}
{
    /* <div
                        className={`w-fit max-w-[60%] ${
                            index % 2 == 0 && "bg-[#a6b44e] self-end"
                        } ${
                            index % 2 == 1 && "bg-green-800 self-start"
                        } px-2 py-1 rounded`}
                        key={index}
                    >
                        {msg}
                    </div> */
}
