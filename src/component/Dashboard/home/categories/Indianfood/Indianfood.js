import React, { useState } from "react";
import Food from "../../../../foodimage";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";
import PaymentModal from "./PaymentModel";

function Indianfood() {
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Alternative filtering if your data structure is different
    let BiryaniItems = Food.filter((ele) => {
        const isIndian = ele.titlename === 'IndianFood';
        const isBiryani = ele.title && (
            ele.title.toLowerCase().includes('biryani') ||
            ele.title.toLowerCase().includes('briyani') ||
            ele.title.toLowerCase().includes('biriyani') ||
            ele.category === 'biryani' ||
            ele.type === 'biryani'
        );
        return isIndian && isBiryani;
    });

    // If no biryani items found, show all Indian food as fallback
    let Food1 = BiryaniItems.length > 0 ? BiryaniItems : Food.filter((ele) => ele.titlename === 'IndianFood').slice(0, 4);

    let history = useHistory();

    function AddtoCart(ele) {
        dispatch(addTocart(ele));
    }

    function detail(id) {
        history.push(`/singledish?id=${id}`);
    }

    function Alldish(titleId) {
        history.push(`/alldish?id=${titleId}`);
    }

    const handleOrderNow = (foodItem) => {
        setSelectedFood({
            ...foodItem,
            selectedQuantity: quantity, // Pass selected quantity
            totalAmount: foodItem.rate * quantity // Calculate total amount
        });
        setShowModal(true);
        setQuantity(1); // Reset quantity for next order
    };

    const increaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const decreaseQuantity = () => {
        setQuantity(prev => prev > 1 ? prev - 1 : 1);
    };


    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedFood(null);
    };

    const handleOrderSubmit = (orderData) => {
        // Handle order submission
        console.log("Order submitted:", orderData);
        alert("Order placed successfully! Thank you for your payment.");
        setShowModal(false);
        setSelectedFood(null);
    };

    return (
        <div className="container-fluid py-4 bg-light">
            {/* Section Header */}
            <div className="row mb-4">
                <div className="col-12 text-center">
                    <h2 className="text-danger fw-bold mb-2">
                        <i className="fas fa-utensils me-2"></i>
                        Biryani Specials
                    </h2>
                    <p className="text-muted mb-0">Authentic Indian biryanis with rich flavors and aromatic spices</p>
                    <div className="mt-3">
                        <span className="badge bg-danger me-2">Hyderabadi</span>
                        <span className="badge bg-warning me-2">Lucknowi</span>
                        <span className="badge bg-success me-2">Kolkata</span>
                        <span className="badge bg-info">Malabar</span>
                    </div>
                </div>
            </div>

            {/* Biryani Cards */}
            <div className="row justify-content-center">
                <div className="col-12">
                    <div className="row g-4 justify-content-center">
                        {Food1.map((ele) => (
                            <div key={ele.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-10">
                                <div className="card h-100 shadow border-0 food-card hover-shadow">
                                    {/* Food Image */}
                                    <div
                                        className="card-img-top position-relative overflow-hidden"
                                        style={{
                                            height: '220px',
                                            cursor: 'pointer',
                                            background: '#f8f9fa'
                                        }}
                                        onClick={() => detail(ele.id)}
                                    >
                                        <img
                                            src={ele.url}
                                            alt={ele.title}
                                            className="w-100 h-100 object-fit-cover transition-all"
                                        />
                                        <div className="position-absolute top-0 end-0 m-2">
                                            <span className="badge bg-danger">
                                                <i className="fas fa-fire me-1"></i> Hot
                                            </span>
                                        </div>
                                        <div className="position-absolute top-0 start-0 m-2">
                                            <span className="badge bg-success">
                                                <i className="fas fa-leaf me-1"></i> Fresh
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="card-body d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <h6 className="card-title fw-bold text-dark mb-0 flex-grow-1">
                                                {ele.title}
                                            </h6>
                                            <span className="badge bg-light text-dark border ms-2">
                                                <i className="fas fa-weight me-1"></i>
                                                {ele.quantity}
                                            </span>
                                        </div>

                                        <p className="text-muted small mb-3">
                                            <i className="fas fa-clock me-1"></i>
                                            30-40 mins • <i className="fas fa-user me-1"></i>Serves 2
                                        </p>

                                        {/* Price and Rating */}
                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h5 className="text-success mb-0 fw-bold">
                                                    ₹{ele.rate}
                                                </h5>
                                                <div className="rating small">
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star-half-alt text-warning"></i>
                                                    <small className="text-muted ms-1">(48)</small>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="d-grid gap-2">
                                                <div className="quantity-selector mb-3">
                                                    <div className="d-flex align-items-center justify-content-center">
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={decreaseQuantity}
                                                        >
                                                            -
                                                        </button>
                                                        <span className="mx-3 fw-bold">{quantity}</span>
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={increaseQuantity}
                                                        >
                                                            +
                                                        </button>
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-sm fw-bold py-2"
                                                    onClick={() => handleOrderNow(ele)}
                                                >
                                                    <i className="fas fa-bolt me-1"></i>
                                                    ORDER NOW
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            <PaymentModal
                show={showModal}
                onClose={handleCloseModal}
                foodItem={selectedFood}
                onSubmit={handleOrderSubmit}
            />

            {/* Special Offer Banner */}
            <div className="row mt-5">
                <div className="col-12">
                    <div className="bg-gradient-to-r from-warning to-orange text-dark rounded p-4 text-center shadow-sm">
                        <h5 className="mb-2 fw-bold">
                            <i className="fas fa-gift me-2"></i>
                            SPECIAL OFFER!
                        </h5>
                        <p className="mb-0 fs-6">Get 20% off on all biryanis today! Use code: <strong className="fs-5">BIRYANI20</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Indianfood;