import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Header from "../header/header";
import Footer from "../footer/footer";
import { useSelector, useDispatch } from "react-redux";
import { getTotals } from "../cart/cartslice";
import { useEffect } from "react";
import Indianfood from "./categories/Indianfood/Indianfood";
// import Italianfood from "./categories/Italian food/Italianfood";
// import Koreanfood from "./categories/korean food/Koreanfood";

function Home() {
    const cart = useSelector((state) => state.cart)
    let dispatch = useDispatch()
    useEffect(() => {
        dispatch(getTotals())
    }, [cart, dispatch])

    const slides = [
        { url: require("../image/choudhary.png"), title: 'Delicious Food' },
        { url: require("../image/choudhary.png"), title: 'Fresh Ingredients' },
        { url: require("../image/choudhary.png"), title: 'Perfect Ambiance' }
    ]

    return (
        <div className="home">
            <Header />

            {/* Hero Section - Reduced Height */}
            <section className="hero-section">
                <div id="foodCarousel" className="carousel slide" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                type="button"
                                data-bs-target="#foodCarousel"
                                data-bs-slide-to={index}
                                className={index === 0 ? "active" : ""}
                                aria-current={index === 0 ? "true" : "false"}
                                aria-label={`Slide ${index + 1}`}
                            ></button>
                        ))}
                    </div>

                    <div className="carousel-inner">
                        {slides.map((slide, index) => (
                            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                <img
                                    src={slide.url}
                                    className="d-block w-100"
                                    alt={slide.title}
                                    style={{ height: "350px", objectFit: "cover" }}
                                />
                                <div className="carousel-caption d-none d-md-block mb-4">
                                    <h3 className="fw-bold">{slide.title}</h3>
                                    <p className="mb-0">Experience the best flavors in town</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#foodCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button className="carousel-control-next" type="button" data-bs-target="#foodCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </section>

            {/* Categories Section - Only Indian Food for now */}
            <div className="categories-section">
                <Indianfood />
                {/* <Italianfood /> */}
                {/* <Koreanfood /> */}
            </div>

            {/* <Footer /> */}
        </div>
    )
}

export default Home;