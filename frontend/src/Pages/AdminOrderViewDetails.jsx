import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrderViewDetails = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { order_number } = useParams();

  const [data, setData] = useState({});
  const [formData, setFormData] = useState({
    status: "",
    remark: "",
  });

  const [refresh, setRefresh] = useState(false);

  const fetched = useRef(false);
  const AdminUser = localStorage.getItem("adminUser");

  /* ---------------- FETCH ORDER ---------------- */

  useEffect(() => {
    if (!AdminUser) {
      navigate("/admin-login");
      return;
    }

    if (fetched.current && !refresh) return;
    fetched.current = true;

    const fetchOrder = async () => {
      try {
        const response = await fetch(
          `${BASEURL}/api/admin/order-detail/${order_number}/`
        );

        const result = await response.json();

        if (response.ok) {
          setData(result);
        } else {
          toast.warning(result.error || "Unable to fetch order");
        }
      } catch (error) {
        console.log("Fetch error:", error);
        toast.error("Server error while fetching order");
      }
    };

    fetchOrder();
  }, [order_number, AdminUser, navigate, refresh]);

  const { address, order, track } = data;

  /* ---------------- STATUS LIST ---------------- */

  const status_list = [
    "Order Confirmed",
    "Food Being Prepared",
    "Food Pickup",
    "Food Delivered",
    "Order Cancelled",
  ];

  const currentOrderStatus = address?.order_final_status || "";

  const visibleStatusOption = status_list.slice(
    status_list.indexOf(currentOrderStatus) + 1
  );

  /* ---------------- HANDLE CHANGE ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* ---------------- HANDLE SUBMIT ---------------- */

  const handleStatusSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${BASEURL}/api/admin/update-order-status/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            order_number: order_number,
            status: formData.status,
            remark: formData.remark,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        toast.success("Order status updated successfully");

        setFormData({
          status: "",
          remark: "",
        });

        setRefresh(!refresh); // trigger refresh
      } else {
        toast.warning(result.error || "Unable to update status");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server error while updating status");
    }
  };

  /* ---------------- LOADING ---------------- */

  if (!address) {
    return (
      <AdminLayout>
        <ToastContainer position="top-center" />
        <p className="text-center m-5">Loading.....</p>
      </AdminLayout>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <AdminLayout>
      <ToastContainer position="top-center" />

      <h2 className="text-center my-3">Order # {address?.order_number}</h2>

      {/* USER + ORDER TABLES */}

      <div className="row">
        <div className="col-md-6 p-3">
          <h5>User Info</h5>

          <table className="table table-bordered">
            <tbody>
              <tr>
                <th>First Name</th>
                <td>{address.first_name}</td>
              </tr>

              <tr>
                <th>Last Name</th>
                <td>{address.last_name}</td>
              </tr>

              <tr>
                <th>Email</th>
                <td>{address.email}</td>
              </tr>

              <tr>
                <th>Mobile</th>
                <td>{address.mobile}</td>
              </tr>

              <tr>
                <th>Address</th>
                <td>{address.address}</td>
              </tr>

              <tr>
                <th>Order Time</th>
                <td>{new Date(address.order_time).toLocaleString()}</td>
              </tr>

              <tr>
                <th>Status</th>
                <td>{address.order_final_status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ORDERED FOODS */}

        <div className="col-md-6 p-3">
          <h5>Ordered Foods</h5>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>

            <tbody>
              {order?.map((item, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={`${BASEURL}${item.image}`}
                      width="60"
                      height="45"
                      alt="food"
                    />
                  </td>

                  <td>{item.item_name}</td>
                  <td>{item.item_price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRACKING TABLE */}

      <div className="row my-3">
        <div className="col-md-12">
          <h5>Tracking History</h5>

          <table className="table table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Status</th>
                <th>Remark</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {track?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">
                    No tracking history yet
                  </td>
                </tr>
              ) : (
                track?.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{item.status}</td>
                    <td>{item.remark}</td>
                    <td>{new Date(item.status_date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* UPDATE STATUS FORM */}

      {currentOrderStatus !== "Food Delivered" && currentOrderStatus !== "Order Cancelled" && (
      <div className="row my-3">
      <h5>Update Order Status</h5>
      
      <div className="col-md-12">
        <form onSubmit={handleStatusSubmit} className="p-3">

          <label className="form-label">Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Status</option>

            {visibleStatusOption.map((status, index) => (
              <option key={index} value={status}>
                {status}
              </option>
            ))}
          </select>

          <label className="form-label my-3">Remark</label>

          <textarea
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            className="form-control"
          ></textarea>

          <div className="text-center py-2 my-2">
            <button className="btn btn-success w-50">
              Update Status
            </button>
          </div>

        </form>
      </div>
    </div>
      )}

    </AdminLayout>
  );
};

export default AdminOrderViewDetails;