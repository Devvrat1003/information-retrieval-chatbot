import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const ImageCarousel = ({ chats }) => {
    return (
        <div className="">
            <Carousel
                showArrows={true}
                infiniteLoop={true}
                // autoPlay={true}
                interval={3000}
                showThumbs={false}
                dynamicHeight={true}
                className="w-full"
            >
                {chats.images.map((pair, index) => (
                    <div key={index} className="">
                        <p className="text-white text-xl py-2">{pair[0]}</p>
                        <img
                            src={pair[1]}
                            alt={`Image ${index + 1}`}
                        />
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default ImageCarousel;
