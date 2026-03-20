import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "../Css/TrackOrder.css";
import "react-toastify/dist/ReactToastify.css";

const TrackOrder = () => {
  const [ordersNumber, setOrderNumber] = useState("");
  const [trackingData, setTrackingData] = useState([]);
  const [orderStatus, setOrderStatus] = useState(null); 
  const { order_number } = useParams();

  useEffect(() => {
    if (order_number) {
      setOrderNumber(order_number);
      handleTrackingOrder(order_number);
    }
  }, [order_number]);

  const handleTrackingOrder = async (order_number) => {
    if (!order_number) {
      toast.warning("Please enter order number");
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8000/api/track-order/${order_number}/`
      );
      const data = await response.json();

 
      const statusRes = await fetch(
        `http://localhost:8000/api/single-order-address-detail/${order_number}/`
      );
      const statusData = await statusRes.json();

      if (response.ok) {
        setTrackingData(data);
      } else {
        toast.error(data.error || "Failed to fetch tracking");
      }

      if (statusRes.ok) {
        setOrderStatus(statusData.order_final_status);
      }

    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer />

      <div className="container py-4">
        {/* Heading */}
        <h3 className="mb-3">
          <i className="fas fa-map-marker-alt me-2"></i>Track Your Order
        </h3>

        {/* Input */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="fas fa-receipt"></i>
          </span>
          <input
            type="text"
            className="form-control"
            value={ordersNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number"
          />
        </div>

        <button
          onClick={() => handleTrackingOrder(ordersNumber)}
          className="btn btn-primary mb-4"
        >
          <i className="fas fa-truck me-2"></i>Track
        </button>

     
        {orderStatus === null ? (
          <h5 className="text-center text-muted">
            Search with order number
          </h5>
        ) : trackingData && trackingData.length > 0 ? (
          <>
          
            <div className="card p-4 shadow-sm rounded-4 border-0 mb-4">
              <h5 className="mb-4">
                <i className="fas fa-stream me-2"></i>Order Status Timeline
              </h5>

              <div className="timeline-container">
                {trackingData.map((track, index) => (
                  <div className="timeline-step" key={track.id || index}>
                    <div
                      className="circle"
                      style={{
                        backgroundColor: getStatusColor(track.status),
                      }}
                    >
                      <i className="fas fa-check"></i>
                    </div>

                    <div className="timeline-content text-center">
                      <small className="fw-bold d-block">
                        {track.status}
                      </small>
                      <small className="text-muted">
                        {new Date(track.status_date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </div>

  
            <div className="card p-4 shadow-sm rounded-4 border-0">
              <h5 className="mb-4">Detailed History</h5>

              {trackingData.map((track, index) => (
                <div
                  key={track.id || index}
                  className="d-flex justify-content-between align-items-center border-bottom py-3"
                >
                  <div>
                    <span
                      className="badge"
                      style={{
                        backgroundColor: getStatusColor(track.status),
                        color: getTextColor(track.status),
                      }}
                    >
                      {track.status}
                    </span>

                    <span className="ms-3 fw-semibold">
                      {formatStatusText(track.status)}
                    </span>
                  </div>

                  <small className="text-muted">
                    {new Date(track.status_date).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </>
        ) : (
          <h5 className="text-center">
            Order is Pending or not Confirmed by Restaurant
          </h5>
        )}
      </div>
    </PublicLayout>
  );
};

export default TrackOrder;



const getStatusColor = (status) => {
  if (!status) return "#6c757d";

  switch (status.toLowerCase().trim()) {
    case "order confirmed":
      return "#17a2b8";
    case "food being prepared":
      return "#ffc107";
    case "food pickup":
      return "#0d6efd";
    case "food delivered":
      return "#198754";
    default:
      return "#6c757d";
  }
};

const getTextColor = (status) => {
  if (!status) return "#fff";

  if (status.toLowerCase().includes("prepared")) {
    return "#000";
  }
  return "#fff";
};

const formatStatusText = (status) => {
  if (!status) return "";

  const s = status.toLowerCase();

  if (s === "order confirmed") return "Order Confirmed";
  if (s === "food being prepared") return "Prepared";
  if (s === "food pickup") return "Pickup";
  if (s === "food delivered") return "Delivered";

  return status;
};