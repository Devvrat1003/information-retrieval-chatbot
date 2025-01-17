import Chatbot from "../components/chatbot";
import hotel from "../assets/hotel.jpg";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { chatState, showChatState, showImageState } from "../atom/chatState";
import Typewriter from "typewriter-effect";
import { Carousel } from "react-responsive-carousel";
import ImageCarousel from "../components/imageCarousel";

export default function Hero() {
    const [showChat, setShowChat] = useRecoilState(showChatState);
    const [showImage, setShowImage] = useRecoilState(showImageState);

    const chats = useRecoilValue(chatState);

    const toggleChat = async () => {
        setShowChat(!showChat);
    };

    return (
        <div
            className={`static bg-cover min-h-screen flex`}
            style={{
                backgroundImage: `url(${hotel})`,
            }}
        >
            <div className={`text-white bg-black w-full bg-opacity-70 p-2`}>
                <div className="p-[5%] flex flex-col gap-16 md:gap-10 items-center md:items-start">
                    <p className="text-5xl md:text-7xl text-center w-4/5 md:text-left md:w-3/5 xl:w-1/3">
                        Welcome to Swaroop Vilas Hotel
                    </p>
                    <div className="text-2xl md:text-3xl text-justify md:text-left md:w-4/5 lg:w-3/5">
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
                    </div>
                    <p className="text-xl font-light text-justify md:text-left md:w-3/5 lg:w-1/2">
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

            {showImage && chats.images.length > 0 && (
                // <div className="absolute h-screen w-screen">
                //     {/* <div className="h-full bg-black flex items-center gap-2 p-2 w-max rounded overflow-x-scroll"> */}
                //     <Carousel>
                //         {chats.images.map((pair, index) => {
                //             return (
                //                 <div className=" bg-blue-300 ">
                //                     <img
                //                         key={index}
                //                         src={pair[1]}
                //                         alt="Image urls"
                //                     />
                //                 </div>
                //             );
                //         })}
                //     </Carousel>
                //     {/* </div> */}
                <div className="absolute min-h-screen backdrop-blur-lg flex justify-center items-center">
                    <div className="w-1/2 ">
                        <ImageCarousel chats={chats} />
                    </div>
                </div>
                // </div>
            )}
        </div>
    );
}
