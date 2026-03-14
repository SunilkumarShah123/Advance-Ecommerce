import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaReceipt,
  FaMapMarkerAlt,
  FaFileInvoice,
  FaTrash,
} from "react-icons/fa";

const SingleOrderDetail = () => {
  const userId = localStorage.getItem("userId");
  const [orderItems, setOrderItems] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [grandTotal,setGrandTotal]=useState(0)
  const { order_number } = useParams();
  const navigate = useNavigate();

  // Fetch order items
  useEffect(() => {
    const fetchOrderedItems = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/single-order-detail/${order_number}/`
        );

        const result = await response.json();

        if (response.ok) {
          setOrderItems(result);
          const grand_total=result.reduce((sum,item)=>( sum+item.food.item_price * item.quantity),0)
          setGrandTotal(grand_total)
          
        } else {
          toast.error(result.error || "Error fetching order items");
        }
      } catch (error) {
        console.log("Server Error", error);
      }
    };

    fetchOrderedItems();
  }, [userId, order_number, navigate]);

  // Fetch address
  useEffect(() => {
    const fetchOrderAddress = async () => {
      if (!userId) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8000/api/single-order-address-detail/${order_number}/`
        );

        const result = await response.json();

        if (response.ok) {
          setOrderAddress(result);
        } else {
          toast.error(result.error || "Error fetching address detail");
        }
      } catch (error) {
        console.log("Server Error", error);
      }
    };

    fetchOrderAddress();
  }, [userId, order_number, navigate]);

  // Loading state
  if (orderItems.length === 0 || !orderAddress) {
    return (
      <PublicLayout>
        <div className="container py-5">
          <h4>Loading Order Details...</h4>
        </div>
      </PublicLayout>
    );
  }



  return (
    <PublicLayout>
      <div className="container py-5">
        <h2 className="mb-4 text-primary">
          <FaReceipt className="me-2" />
          Order #{order_number} Details
        </h2>

        <div className="row">

          {/* LEFT SIDE FOOD ITEMS */}
          <div className="col-md-8">
            {orderItems.map((item, index) => (
              <div className="card shadow-sm p-3 mb-3" key={index}>
                <div className="row align-items-center">

                  <div className="col-md-4">
                    <img
                      src={`http://localhost:8000/${item.food.image}`}
                      alt=""
                      className="img-fluid rounded"
                    />
                  </div>

                  <div className="col-md-8">
                    <h5>{item.food.item_name}</h5>

                    <p className="text-muted">
                      {item.food.item_description}
                    </p>

                    <p>
                      <strong>Price:</strong> ₹ {item.food.item_price}
                    </p>

                    <p>
                      <strong>Quantity:</strong> {item.quantity}
                    </p>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE DELIVERY DETAILS */}
          <div className="col-md-4">
            <div className="card shadow-sm p-4">

              <h5 className="mb-3">
                <FaMapMarkerAlt className="text-danger me-2" />
                Delivery Details
              </h5>

              <p>
                <strong>Date:</strong>{" "}
                {new Date(orderAddress.order_time).toLocaleString()}
              </p>

              <p>
                <strong>Address:</strong> {orderAddress.address}
              </p>

              <p>
                <strong>Status:</strong> {orderAddress.order_final_status}
              </p>

              <p>
                <strong>Payment Mode:</strong>{" "}
                <span className="badge bg-info text-dark">
                  {orderAddress.payment_mode}
                </span>
              </p>

              <p>
                <strong>Total:</strong> ₹ {grandTotal}
              </p>

              <a
                href={`http://localhost:8000/api/invoices/${order_number}/`}
                className="btn btn-primary"
              >
                <FaFileInvoice className="me-1" />
                Invoice
              </a>

              <a href="#" className="btn btn-danger mt-3">
                <FaTrash className="me-1" />
                Cancel
              </a>

            </div>
          </div>

        </div>
      </div>

      <ToastContainer />
    </PublicLayout>
  );
};

export default SingleOrderDetail;