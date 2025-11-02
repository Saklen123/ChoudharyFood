import React, { useState, useEffect } from "react";
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../../../../config/firebase';

function PaymentModal({ show, onClose, foodItem, onSubmit }) {
    const [deliveryOption, setDeliveryOption] = useState("hotel");
    const [address, setAddress] = useState("");
    const [paymentProof, setPaymentProof] = useState(null);
    const [isPaymentVerified, setIsPaymentVerified] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const selectedQuantity = foodItem?.selectedQuantity || 1;
    const totalAmount = foodItem?.totalAmount || foodItem?.rate;

    const upiId = "7218740510@ybl";
    const upiUrl = `upi://pay?pa=${upiId}&pn=Food%20Restaurant&am=${totalAmount}&cu=INR`;

    // Generate QR code using external service
    useEffect(() => {
        if (foodItem) {
            // Using a reliable QR code generation service
            const qrText = encodeURIComponent(upiUrl);
            const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${qrText}`;
            setQrCodeUrl(qrCodeImageUrl);
        }
    }, [foodItem, upiUrl]);

    const handlePaymentProof = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPaymentProof(file);
            // Simulate payment verification
            setTimeout(() => {
                setIsPaymentVerified(true);
            }, 2000);
        }
    };

    const handleSubmit = async () => {
        if (!isPaymentVerified) {
            alert("Please upload payment proof and wait for verification.");
            return;
        }

        if (deliveryOption === "delivery" && !address.trim()) {
            alert("Please enter delivery address.");
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                foodItem: {
                    id: foodItem.id,
                    title: foodItem.title,
                    rate: foodItem.rate,
                    quantity: foodItem.selectedQuantity || 1,
                    image: foodItem.url
                },
                totalAmount: totalAmount,
                deliveryOption: deliveryOption,
                address: deliveryOption === "delivery" ? address : null,
                paymentVerified: isPaymentVerified,
                paymentProof: paymentProof?.name || 'Not uploaded',
                upiId: upiId,
                status: 'pending', // pending, confirmed, preparing, ready, completed
                customerPhone: '', // You can add customer details
                customerName: '',  // You can add customer details
                createdAt: serverTimestamp(),
                orderId: `ORD${Date.now()}`
            };

            // Store in Firebase
            const docRef = await addDoc(collection(db, 'orders'), orderData);

            console.log("Order stored with ID: ", docRef.id);
            alert("Order placed successfully! Your order ID: " + orderData.orderId);

            await onSubmit(orderData);

        } catch (error) {
            console.error("Error storing order: ", error);
            alert("Error placing order. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!show || !foodItem) return null;

    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} tabIndex="-1">
            <div className="modal-dialog modal-xl modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    {/* Modal Header */}
                    <div className="modal-header bg-danger text-white py-3">
                        <h5 className="modal-title fw-bold fs-4">
                            <i className="fas fa-utensils me-2"></i>
                            Complete Your Order
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Modal Body */}
                    <div className="modal-body p-4">
                        <div className="row">
                            {/* Left Column - Food Image and Details */}
                            <div className="col-lg-5 mb-4">
                                <div className="sticky-top" style={{ top: '20px' }}>
                                    {/* Food Image */}
                                    <div className="card border-0 shadow-sm mb-4">
                                        <img
                                            src={foodItem.url}
                                            alt={foodItem.title}
                                            className="card-img-top rounded"
                                            style={{ height: '250px', objectFit: 'cover' }}
                                        />
                                        <div className="card-body text-center">
                                            <h4 className="card-title fw-bold text-danger">{foodItem.title}</h4>
                                            <p className="text-muted mb-2">{foodItem.quantity}</p>
                                            <div className="d-flex justify-content-center align-items-center">
                                                <span className="badge bg-success fs-6 me-2">
                                                    <i className="fas fa-clock me-1"></i>
                                                    30-40 mins
                                                </span>
                                                <span className="badge bg-info fs-6">
                                                    <i className="fas fa-user me-1"></i>
                                                    Serves 2
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="card border-0 bg-light">
                                        <div className="card-body">
                                            <h6 className="fw-bold text-danger mb-3">
                                                <i className="fas fa-receipt me-2"></i>
                                                ORDER SUMMARY
                                            </h6>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-semibold">Quantity:</span>
                                                <span>{selectedQuantity}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="fw-semibold">Price per item:</span>
                                                <span>₹{foodItem?.rate}</span>
                                            </div>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="fw-bold fs-5">Total:</span>
                                                <span className="fw-bold fs-5 text-success">₹{totalAmount}</span>
                                            </div>

                                            <hr />

                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Payment and Delivery Options */}
                            <div className="col-lg-7">
                                {/* Payment QR Code */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white">
                                        <h6 className="fw-bold text-danger mb-0">
                                            <i className="fas fa-qrcode me-2"></i>
                                            SCAN TO PAY
                                        </h6>
                                    </div>
                                    <div className="card-body text-center">
                                        <div className="border rounded p-4 bg-white">
                                            <div className="qr-container mb-3">
                                                <div className="bg-white p-3 rounded border d-inline-block">
                                                    {qrCodeUrl ? (
                                                        <img
                                                            src={qrCodeUrl}
                                                            alt="UPI QR Code"
                                                            className="qr-code-image"
                                                            style={{ width: '200px', height: '200px' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="d-flex align-items-center justify-content-center bg-light"
                                                            style={{ width: '200px', height: '200px' }}
                                                        >
                                                            <div className="spinner-border text-primary" role="status">
                                                                <span className="visually-hidden">Loading QR Code...</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="payment-details">
                                                <div className="fw-bold text-dark fs-5 mb-2">{upiId}</div>
                                                <div className="mb-2">
                                                    <span className="badge bg-primary me-2">UPI ID</span>
                                                    <span className="badge bg-success">₹{foodItem.rate}</span>
                                                </div>
                                                <small className="text-muted d-block mb-2">
                                                    Scan the QR code with any UPI app to pay
                                                </small>
                                                <div className="alert alert-info py-2 small">
                                                    <i className="fas fa-info-circle me-2"></i>
                                                    Amount will be automatically filled when you scan
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Alternative: Manual UPI Payment */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white">
                                        <h6 className="fw-bold text-danger mb-0">
                                            <i className="fas fa-mobile-alt me-2"></i>
                                            ALTERNATIVE PAYMENT METHOD
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="border rounded p-3 bg-light">
                                            <div className="row align-items-center">
                                                <div className="col-md-8">
                                                    <h6 className="fw-bold mb-2">Manual UPI Payment</h6>
                                                    <p className="mb-2 small text-muted">
                                                        If QR code doesn't work, you can manually send payment to:
                                                    </p>
                                                    <div className="bg-white p-3 rounded border">
                                                        <strong className="text-primary">{upiId}</strong>
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-center">
                                                    <button
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(upiId);
                                                            alert('UPI ID copied to clipboard!');
                                                        }}
                                                    >
                                                        <i className="fas fa-copy me-1"></i>
                                                        Copy UPI ID
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                                {/* Delivery Options */}
                                <div className="card border-0 shadow-sm mb-4">
                                    <div className="card-header bg-white">
                                        <h6 className="fw-bold text-danger mb-0">
                                            <i className="fas fa-truck me-2"></i>
                                            DELIVERY OPTIONS
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <div
                                                    className={`card delivery-option-card ${deliveryOption === 'hotel' ? 'border-danger bg-danger text-white' : 'border-light'}`}
                                                    onClick={() => setDeliveryOption('hotel')}
                                                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                                >
                                                    <div className="card-body text-center py-4">
                                                        <i className="fas fa-store fa-2x mb-3"></i>
                                                        <h6 className="fw-bold mb-2">Pickup from Hotel</h6>
                                                        <small>Customer will come to collect the order</small>
                                                        <div className="mt-2">
                                                            <span className="badge bg-success">Free</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div
                                                    className={`card delivery-option-card ${deliveryOption === 'delivery' ? 'border-danger bg-danger text-white' : 'border-light'}`}
                                                    onClick={() => setDeliveryOption('delivery')}
                                                    style={{ cursor: 'pointer', transition: 'all 0.3s' }}
                                                >
                                                    <div className="card-body text-center py-4">
                                                        <i className="fas fa-home fa-2x mb-3"></i>
                                                        <h6 className="fw-bold mb-2">Home Delivery</h6>
                                                        <small>Delivery at your doorstep</small>
                                                        <div className="mt-2">
                                                            <span className="badge bg-warning text-dark">₹30 Delivery</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Field - Only show for delivery */}
                                {deliveryOption === 'delivery' && (
                                    <div className="card border-0 shadow-sm mb-4">
                                        <div className="card-header bg-white">
                                            <h6 className="fw-bold text-danger mb-0">
                                                <i className="fas fa-map-marker-alt me-2"></i>
                                                DELIVERY ADDRESS
                                            </h6>
                                        </div>
                                        <div className="card-body">
                                            <textarea
                                                className="form-control"
                                                rows="4"
                                                placeholder="Enter your complete delivery address with landmarks..."
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                style={{ resize: 'none' }}
                                            ></textarea>
                                            <small className="text-muted">
                                                Please provide complete address for smooth delivery
                                            </small>
                                        </div>
                                    </div>
                                )}

                                {/* Payment Proof Upload */}
                                <div className="card border-0 shadow-sm">
                                    <div className="card-header bg-white">
                                        <h6 className="fw-bold text-danger mb-0">
                                            <i className="fas fa-camera me-2"></i>
                                            UPLOAD PAYMENT PROOF
                                        </h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="border rounded p-3 bg-light">
                                            <div className="mb-3">
                                                <label htmlFor="paymentProof" className="form-label fw-semibold">
                                                    Upload Payment Screenshot
                                                </label>
                                                <input
                                                    id="paymentProof"
                                                    type="file"
                                                    className="form-control"
                                                    accept="image/*,.pdf"
                                                    onChange={handlePaymentProof}
                                                />
                                            </div>
                                            <small className="text-muted">
                                                Upload screenshot of successful payment transaction from your UPI app
                                            </small>

                                            {paymentProof && (
                                                <div className="mt-3">
                                                    <div className={`alert ${isPaymentVerified ? 'alert-success' : 'alert-warning'} d-flex align-items-center`}>
                                                        <i className={`fas ${isPaymentVerified ? 'fa-check-circle' : 'fa-clock'} me-2`}></i>
                                                        <div>
                                                            <strong>Payment proof uploaded:</strong> {paymentProof.name}
                                                            {!isPaymentVerified && (
                                                                <div className="small mt-1">
                                                                    <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                                                    Verifying payment...
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {isPaymentVerified && (
                                                <div className="mt-2">
                                                    <div className="alert alert-success d-flex align-items-center">
                                                        <i className="fas fa-shield-alt me-2"></i>
                                                        <div>
                                                            <strong>Payment Verified!</strong>
                                                            <div className="small">Your payment has been successfully verified</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="modal-footer bg-light py-3">
                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            <i className="fas fa-times me-2"></i>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-success px-4 fw-bold"
                            onClick={handleSubmit}
                            disabled={!isPaymentVerified || (deliveryOption === 'delivery' && !address.trim()) || isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check me-2"></i>
                                    Confirm Order
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentModal;