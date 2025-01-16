import Chatbot from "../components/chatbot";
import hotel from "../assets/hotel.jpg";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { showChatState } from "../atom/chatState";
import Typewriter from "typewriter-effect";

export default function Hero() {
    const [showChat, setShowChat] = useRecoilState(showChatState);

    const toggleChat = async () => {
        setShowChat(!showChat);
    };

    return (
        <div
            className={`bg-cover lg:h-screen flex`}
            style={{
                backgroundImage: `url(${hotel})`,
            }}
        >
            <div className={`text-white bg-black w-full bg-opacity-70 p-2`}>
                <div className="ml-[5%] mt-[5%] flex flex-col gap-10">
                    <p className="text-7xl w-1/3">
                        Welcome to Swaroop Vilas Hotel
                    </p>
                    <p className="text-3xl w-1/2">
                        Experience Royal Elegance at Swaroop Vilas Hotel –
                        <Typewriter
                            onInit={(typewriter) => {
                                typewriter
                                    .typeString("Step into Royalty")
                                    .pauseFor(1000)
                                    .deleteAll()
                                    .pauseFor(500);
                                typewriter
                                    .typeString(
                                        "Where Luxury Meets Tranquility!"
                                    )
                                    .pauseFor(1500)

                                    .start();
                            }}
                            options={{
                                loop: true,
                                delay: 100,
                            }}
                        />
                    </p>
                    <p className="text-xl font-light w-1/2">
                        A serene retreat in Udaipur overlooking Lake Swaroop
                        Sagar. Blending Rajasthani heritage with modern luxury,
                        we offer elegant rooms, world-class dining, a tranquil
                        spa, and exceptional hospitality. Whether for relaxation
                        or celebration, experience timeless charm and
                        unforgettable moments with us. Your journey begins here!
                    </p>
                </div>
            </div>
            <div className="fixed right-4 bottom-4">
                <button
                    className={`${
                        showChat ? "hidden" : "visible"
                    } fixed right-4 bottom-4`}
                    onClick={toggleChat}
                >
                    <IoChatbubbleEllipsesSharp
                        size={60}
                        color="pink"
                        className="scale-x-[-1]"
                    />
                </button>
                <div
                    className={`${
                        showChat ? "scale-100 opacity-100" : "scale-0 opacity-0"
                    } transform origin-bottom-right transition-all duration-500 ease-in-out`}
                >
                    <Chatbot />
                </div>
            </div>
        </div>
    );
}
