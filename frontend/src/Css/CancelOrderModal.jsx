import React from "react";
import { useState, useEffect } from "react";

const CancelOrderModal = ({
  show,
  handleCloseModal,
  order_number,
  payment_mode,
}) => {
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const handleSubmit = async () => {
    if (!remark.trim()) {
      setError("Please fillup the reason for cancellation !");
    }

    try {
      const response = await fetch(
        `${BASEURL}/api/cancel-order/${order_number}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            remark,
          }),
        },
      );
      const result = await response.json();

      if (response.status === 200) {
        let msg = result.msg;
        if (payment_mode === "online") {
          msg += "\n Since Payment is online.ysMoney will be refunded in 2 da";
        }
        setMessage(msg);
        setRemark("");
        setError("");
      } else {
        setError(result.error | "Failed to cancel Order");
      }
    } catch (error) {
      console.log("Something went wrong:", error);
    }
  };
  return (
    <div className={`modal my-3 fade ${show ? "show d-block" : ""}`}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title ">Cancel Order # {order_number}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              onClick={handleCloseModal}
            ></button>
          </div>
          <div className="modal-body">
            {message ? (
              <>
                <div className="alert alert-success">{message}</div>
              </>
            ) : (
              <>
                <label htmlFor="remark" className="form-label fw-semibold my-2">
                  Reason for cancellation
                </label>
                <textarea
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  id="remark"
                  className="form-control"
                  placeholder="Enter the reason here ...."
                ></textarea>
                {error && (<div className="text-danger mt-2">{error}</div>) }
              </>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              data-bs-dismiss="modal"
              onClick={handleCloseModal}
            >
              Close
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleSubmit}
            >
              Cancel Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelOrderModal;
