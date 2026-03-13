import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Payment = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleChange = (e) => {
    setCardDetails((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const handlePlaceOrder = async () => {
    if (paymentMode === "online") {
      const { cardNumber, expiry, cvv } = cardDetails;
      if (!cardNumber || !expiry || !cvv) {
        toast.error("Some Card Detail fields are missing.Please fill properly");
        return;
      }
    }
    try {
      const response = await fetch("http://localhost:8000/api/place-order/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userId,
          address: address,
          paymentMode: paymentMode,
          cardNumber: paymentMode === "online" ? cardDetails.cardNumber : "",
          expiry: paymentMode === "online" ? cardDetails.expiry : "",
          cvv: paymentMode === "online" ? cardDetails.cvv : "",
        }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.msg || "Order Placed Successfully");
        setTimeout(() => {
          navigate("/my-orders");
        }, 1500);
      } else {
        toast.error(result.error || "something went wrong!!!");
      }
    } catch (error) {
      console.log("Server error", error);
    }
  };
  return (
    <>
      <PublicLayout>
        <ToastContainer className="text-center" autoClose={2000} />
        <div className="container py-5">
          <h3 className="text-center">
            <i className="fas fa-credit-card"></i>
            Payment
          </h3>
          <div className="card shadow-sm p-4 my-4">
            <label className="form-label fw-semibold" htmlFor="address">
              Delivery Address
            </label>
            <textarea
              className="form-control"
              name="address"
              id="address"
              placeholder="Enter your full delievery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            ></textarea>
            <div className="my-3">
              <div>
                <label className="form-check-label fw-semibold me-3" htmlFor="cod">
                  Cash on delivery
                </label>
                <input
                  type="radio"
                  className="form-check-input"
                  name="paymentMode"
                  value={paymentMode}
                  onChange={() => setPaymentMode("cod")}
                  id="cod"
                />
              </div>

              <div className="mt-2">
                <label className="form-check-label fw-semibold me-3" htmlFor="cod">
                  Online
                </label>
                <input
                  type="radio"
                  className="form-check-input"
                  name="paymentMode"
                  value={paymentMode}
                  onChange={() => setPaymentMode("online")}
                  id="online"
                />
              </div>
              {paymentMode === "online" && (
                <>
                  <div className="row my-3">
                    <div className="col-6">
                      <label htmlFor="cardNumber" className="form-label fw-semibold">Card Number</label>
                      <input type="text" id="cardNumber" className="form-control" placeholder="123 **** **** ****" name="cardNumber" onChange={handleChange} />
                    </div>
                    <div className="col-3">
                      <label htmlFor="expiry" className="form-label fw-semibold">Expiry</label>
                      <input type="text"  className="form-control"  name="expiry" id="expiry" placeholder="MM/YY" onChange={handleChange} />
                    </div>
                    <div className="col-3">
                      <label htmlFor="cvv" className="form-label fw-semibold" >CVV</label>
                      <input type="text" id="cvv" className="form-control" name="cvv" placeholder="***" onChange={handleChange} />
                    </div>
                  </div>
                </>
              )}
              
            </div>
            <div>
                <button className="btn btn-success w-100" onClick={handlePlaceOrder}><i className="fas fa-check-circle me-1"></i>Checkout & Payment</button>
              </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export default Payment;
