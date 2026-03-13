import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";

const FoodPickup = () => {

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/orders/pickup/")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.log("Error fetching orders", err));
  }, []);

  return (
    <AdminLayout>

      <div className="text-center mb-3">
        <h4 className="text-primary">
          <i className="fas fa-truck me-2"></i>
          Detail of Food Pickup Orders
        </h4>
      </div>

      <div className="d-flex justify-content-end mb-2">
        <h6 className="text-muted">
          <i className="fas fa-database me-2"></i>
          Total Pickup Orders
          <span className="badge bg-success ms-2">{orders.length}</span>
        </h6>
      </div>

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
                <td colSpan="4" className="text-center">No Orders Found</td>
              </tr>
            ) : (
              orders.map((order, index) => (
                <tr key={order.order_number}>
                  <td>{index + 1}</td>
                  <td>{order.order_number}</td>
                  <td>{new Date(order.order_time).toLocaleDateString()}</td>
                  <td>
                    <Link to={`/admin/order-detail/${order.order_number}`} className="btn btn-info btn-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

    </AdminLayout>
  );
};

export default FoodPickup;