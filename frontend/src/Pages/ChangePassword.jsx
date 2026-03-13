import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import { FaLock, FaKey } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const userId = localStorage.getItem("userId");
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setPasswordData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (passwordData.new_password !== passwordData.confirm_password) {
      toast.error("New Password and Confirm Password do not match");
      return;
    }

    try {
      const response = await fetch(`${BASEURL}/api/user/change-password/${userId}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          current_password: passwordData.current_password,
          new_password: passwordData.new_password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || "Password Changed Successfully");

      } else {
        toast.error(result.error || "Password change failed");
      }
    } catch (error) {
      console.log("Server Error", error);
    }
  };

  return (
    <PublicLayout>
      <ToastContainer />

      <div className="container py-5">

        <h2 className="text-center my-3">
          <FaLock className="me-2 text-primary" />
          Change Password
        </h2>

        <div className="card shadow-sm p-4">

          <form onSubmit={handlePasswordSubmit}>
            <div className="row">

              <div className="col-md-12">
                <label className="form-label">Current Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="current_password"
                  value={passwordData.current_password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mt-3">
                <label className="form-label">New Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12 mt-3">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 mt-4">
                <button className="btn btn-primary w-100">
                  <FaKey className="me-2" />
                  Update Password
                </button>
              </div>

            </div>
          </form>

        </div>

      </div>
    </PublicLayout>
  );
};

export default ChangePassword;