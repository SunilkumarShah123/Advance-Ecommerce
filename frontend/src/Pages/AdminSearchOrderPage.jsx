import React, { useState, useEffect } from "react";
import AdminLayout from "../Components/AdminLayout";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/admin.css";

const AdminSearchOrderPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const navigate = useNavigate();
  const adminUser = localStorage.getItem("adminUser");

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
    }
  }, [adminUser, navigate]);

  const handleSearchOrder = async (e) => {
    e.preventDefault();

    if (!searchTerm) return;

    try {
      const response = await fetch(
        `http://localhost:8000/api/admin-search-order/?q=${searchTerm}`
      );

      const result = await response.json();

      if (response.ok) {
        setOrders(result);
        setSearchSubmitted(true);
      } else {
        toast.error(result.error || "Error fetching order items");
        console.log(result.error)
      }
    } catch (error) {
      console.log("Server Error", error);
    }
  };

  return (
    <AdminLayout>
      <div className="text-center mb-3">
        <h4 className="text-primary">
          <i className="fas fa-search me-2"></i>
          Search Orders
        </h4>
      </div>

      <div className="text-center my-4">
        <form onSubmit={handleSearchOrder}>
          <div className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
            <input
              className="form-control"
              placeholder="Search Orders . . . ."
     
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                borderTopRightRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
              type="text"
            />
            <button
              className="btn btn-warning py-2"
              style={{
                borderTopLeftRadius: "0px",
                borderBottomLeftRadius: "0px",
              }}
              type="submit"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {searchSubmitted && (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>S.No</th>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No Orders Found
                  </td>
                </tr>
              ) : (
                orders.map((order, index) => (
                  <tr key={order.order_number}>
                    <td>{index + 1}</td>
                    <td>{order.order_number}</td>
                    <td>
                      {new Date(order.order_time).toLocaleDateString()}
                    </td>
                    <td>
                      <Link
                        to={`/admin/order-detail/${order.order_number}`}
                        className="btn btn-info btn-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminSearchOrderPage;