import React from "react";
import PublicLayout from "./PublicLayout";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaSignInAlt } from "react-icons/fa";
const Login = () => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { identifier, password } = userData;

    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: identifier,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`${data.userName} Login Successfully`);

        setUserData({
          identifier: "",
          password: "",
        });

        localStorage.setItem("userId", data.userId);
        localStorage.setItem("userName", data.userName);

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <>
      <PublicLayout>
        <ToastContainer className="text-center" autoClose={2000} />
        <div className="container vh-100 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg rounded-4 p-4"
            style={{ width: "500px", height: "350px" }}
          >
            <h3 className="text-center text-primary mb-4">User Login</h3>

            <form onSubmit={handleSubmit} className="px-2">
              <div className="mb-3">
                <label className="form-label" htmlFor="identifier">
                  Email or Mobile
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="identifier"
                  value={userData.identifier}
                  placeholder="Enter Email or Mobile Number"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Enter Your Password"
                  value={userData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="d-flex align-items-center gap-3 mt-4">
                <button type="submit" className="btn btn-primary ">
                  <FaSignInAlt className="me-2" />
                  Login
                </button>

                <h5 className="text-muted mb-0 ms-auto">
                  Isn't Registered Yet !
                </h5>

                <Link to="/register">
                  <button className="btn btn-warning ">Register</button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export default Login;
