import React, { useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";

const BetweenDatesReport = () => {

  const [formData, setFormData] = useState({
    from_date: "",
    to_date: "",
    status: "All",
  });

  const [orders, setOrders] = useState([]);
  const [searched, setSearched] = useState(false);

  // handle change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // if fields empty → don't show table
    if (!formData.from_date || !formData.to_date) {
      setOrders([]);
      setSearched(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8000/api/orders-between-dates/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      setOrders(data);
      setSearched(true);

    } catch (error) {
      console.log("Error fetching report:", error);
    }
  };

  return (
    <AdminLayout>

      {/* Title */}
      <div className="text-center mb-4">
        <h3 className="text-primary">
          <i className="fas fa-list me-2"></i>
          Between Dates Reports
        </h3>
      </div>


      {/* Form */}
      <form onSubmit={handleSubmit}>

        <div className="row mb-4">

          {/* From Date */}
          <div className="col-md-4">
            <label className="form-label">From Date</label>
            <input
              type="date"
              name="from_date"
              className="form-control"
              value={formData.from_date}
              onChange={handleChange}
            />
          </div>

          {/* To Date */}
          <div className="col-md-4">
            <label className="form-label">To Date</label>
            <input
              type="date"
              name="to_date"
              className="form-control"
              value={formData.to_date}
              onChange={handleChange}
            />
          </div>

          {/* Status */}
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-control"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="All">All</option>
              <option value="Order Confirmed">Confirmed</option>
              <option value="Not Confirmed">Not Confirmed</option>
              <option value="Food Being Prepared">Being Prepared</option>
              <option value="Food Pickup">Food Pickup</option>
              <option value="Food Delivered">Delivered</option>
              <option value="Order Cancelled">Cancelled</option>
            </select>
          </div>

        </div>

        {/* Search Button */}
        <div className="mb-4">
          <button type="submit" className="btn btn-primary">
            Search Report
          </button>
        </div>

      </form>


      {/* Table (Only after search) */}
      {searched && (
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

export default BetweenDatesReport;