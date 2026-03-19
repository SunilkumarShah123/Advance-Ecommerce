import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBoxOpen, FaEye,FaMapMarkedAlt } from "react-icons/fa";

const MyOrders = () => {
  const userId = localStorage.getItem("userId");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/my-orders/${userId}/`
        );

        const result = await response.json();
        console.log(result[0])
        if (response.ok) {
          setOrders(result);
        } else {
          toast.error(result.error || "Error during fetching Orders");
        }
      } catch (error) {
        console.log("Server Error", error);
      }
    };

    fetchOrders();
  }, [userId, navigate]);

  return (
    <PublicLayout>
      <ToastContainer className="text-center" autoClose={1500} />

      <div className="container py-5">
        <h2 className="text-center">
          <FaBoxOpen className="me-2" />
          My Orders
        </h2>

        {orders.length === 0 ? (
          <div className="my-3 text-center d-flex justify-content-center align-items-center">
            <h3 className="me-3">You haven't placed order yet. Go Shop</h3>
            <button

              onClick={() => navigate("/menu")}
              className="btn btn-primary"
            >
              Menu
            </button>
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="my-3 card shadow-sm">
            <div className="card-body d-flex align-items-center">
              
              <FaBoxOpen className="me-3 text-warning fs-4" />
          
              <div className="flex-grow-1">
                <Link to={`/order-details/${order.order_number}`} className="text-decoration-none">
                  <h5>Order #{order.order_number}</h5>
                </Link>
          
                <p className="mb-0">
                  <strong>Date:</strong>{" "}
                  {new Date(order.order_time).toLocaleString()}
                </p>
          
                <span className="badge bg-secondary">
                  {order.order_final_status}
                </span>
              </div>
          
              <Link className="btn btn-secondary me-2" to={`/track-order/${order.order_number}/`}>
                <FaMapMarkedAlt className="me-1"/>Track
              </Link>
               
              <Link className="btn btn-primary" to={`/order-details/${order.order_number}`}>
                <FaEye className="me-1"/>View
              </Link>
          
            </div>
          </div>
          ))
        )}
      </div>
    </PublicLayout>
  );
};

export default MyOrders;