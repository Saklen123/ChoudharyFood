import React, { useState } from "react";

function Imageslide({ slides }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const slideStyles = {
        width: "100%",
        height: "300px",           // reduced height
        borderRadius: "10px",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${slides[currentIndex].url})`,
        position: "relative",
        transition: "background-image 0.5s ease-in-out", // smooth transition
    };

    function goToPrevious() {
        setCurrentIndex(currentIndex === 0 ? slides.length - 1 : currentIndex - 1);
    }

    function goToNext() {
        setCurrentIndex(currentIndex === slides.length - 1 ? 0 : currentIndex + 1);
    }

    function goToSlide(slideIndex) {
        setCurrentIndex(slideIndex);
    }

    return (
        <div className="sliderstyle" style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
            {/* Arrows */}
            <div className="leftArrowStyles" onClick={goToPrevious} style={arrowStyle}>❰</div>
            <div className="rightArrowStyles" onClick={goToNext} style={arrowStyle}>❱</div>

            {/* Slide */}
            <div style={slideStyles}></div>

            {/* Dots */}
            <div className="dotsContainerStyles" style={dotsContainerStyle}>
                {slides.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        className="dotStyle"
                        onClick={() => goToSlide(slideIndex)}
                        style={{
                            ...dotStyle,
                            backgroundColor: slideIndex === currentIndex ? "#333" : "#bbb",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}

// Optional inline styles for arrows and dots
const arrowStyle = {
    position: "absolute",
    top: "50%",
    fontSize: "2rem",
    color: "#fff",
    cursor: "pointer",
    userSelect: "none",
    zIndex: 1,
    transform: "translateY(-50%)",
    padding: "0 10px",
};

const dotsContainerStyle = {
    display: "flex",
    justifyContent: "center",
    marginTop: "10px",
};

const dotStyle = {
    height: "12px",
    width: "12px",
    margin: "0 5px",
    borderRadius: "50%",
    display: "inline-block",
    cursor: "pointer",
};

export default Imageslide;
