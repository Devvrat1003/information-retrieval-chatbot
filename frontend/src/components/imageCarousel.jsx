import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRecoilState } from "recoil";
import { showImageState } from "../atom/chatState";
import { IoMdClose } from "react-icons/io";

const ImageCarousel = ({ chats }) => {
    const [showImage, setShowImage] = useRecoilState(showImageState);

    return (
        <div className="">
            <Carousel
                showArrows={true}
                infiniteLoop={true}
                autoPlay={true}
                interval={3000}
                showThumbs={false}
                dynamicHeight={true}
                className="w-full"
            >
                {chats.images.map((pair, index) => (
                    <div key={index} className="">
                        <div className="flex text-center items-center px-10 font-serif">
                            <IoMdClose
                                size={20}
                                color="white"
                                className="cursor-pointer"
                                onClick={() => {
                                    setShowImage(false);
                                }}
                            />
                            <p className="text-white text-xl w-full">
                                {pair[0]}
                            </p>
                        </div>
                        <img src={pair[1]} />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ImageCarousel;
