import React from "react";
import Food from "../../../../foodimage";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTocart } from "../../../cart/cartslice";

function Italianfood() {
    const dispatch = useDispatch();
    let Food1 = Food.filter((ele) => ele.titlename === 'ItalianFood');
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

    function order() {
        history.push('/cart');
    }

    return (
        <div className="container-fluid py-4 bg-white">
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center">
                        <h2 className="text-primary fw-bold mb-0">
                            <i className="fas fa-pizza-slice me-2"></i>
                            Italian Food
                        </h2>
                        <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => Alldish(Food1[0]?.titleId)}
                        >
                            View All <i className="fas fa-arrow-right ms-1"></i>
                        </button>
                    </div>
                    <p className="text-muted mb-0">Authentic Italian cuisine with fresh ingredients</p>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <div className="row g-3">
                        {Food1.map((ele) => (
                            <div key={ele.id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                <div className="card h-100 shadow-sm border-0 food-card">
                                    <div
                                        className="card-img-top position-relative overflow-hidden"
                                        style={{ height: '200px', cursor: 'pointer', background: '#f8f9fa' }}
                                        onClick={() => detail(ele.id)}
                                    >
                                        <img
                                            src={ele.url}
                                            alt={ele.title}
                                            className="w-100 h-100 object-fit-cover"
                                            style={{ transition: 'transform 0.3s ease' }}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                    </div>

                                    <div className="card-body d-flex flex-column">
                                        <h6 className="card-title fw-bold text-dark mb-1">
                                            {ele.title}
                                        </h6>
                                        <p className="text-muted small mb-2">
                                            <i className="fas fa-weight me-1"></i>
                                            {ele.quantity}
                                        </p>

                                        <div className="mt-auto">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <h5 className="text-success mb-0">₹{ele.rate}</h5>
                                                <div className="rating small">
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                    <i className="fas fa-star text-warning"></i>
                                                </div>
                                            </div>

                                            <div className="d-grid gap-2">
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={order}
                                                >
                                                    <i className="fas fa-bolt me-1"></i>
                                                    Order Now
                                                </button>
                                                <button
                                                    className="btn btn-outline-primary btn-sm"
                                                    onClick={() => AddtoCart(ele)}
                                                >
                                                    <i className="fas fa-cart-plus me-1"></i>
                                                    Add to Cart
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
        </div>
    );
}

export default Italianfood;