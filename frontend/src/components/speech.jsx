import React from "react";

export default function TextToSpeech(props) {
    const images = props.images;
    return (
        <div>
            {images[1].map((url, index) => {
                <img src={url} alt="Image urls" />;
            })}
        </div>
    );
}
