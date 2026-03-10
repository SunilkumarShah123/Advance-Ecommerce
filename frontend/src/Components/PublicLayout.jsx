import React from "react";
import { useState, useEffect } from "react";
import { useCartCount } from "../Pages/CartContext";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUtensils,
  FaTruck,
  FaUserPlus,
  FaSignInAlt,
  FaUserShield,
  FaShoppingCart,
  FaHeart,
  FaClipboardList,
  FaUserCircle,
  FaSignOutAlt,
  FaCog,
  FaUser,
} from "react-icons/fa";

import "../Css/layout.css";

const PublicLayout = ({ children }) => {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("userName");

  const { cartCount } = useCartCount();

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name);
    }
  }, [userId]);

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("cartItem")
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid px-4">
          <Link className="navbar-brand fw-bold" to="/">
            <FaUtensils className="me-2" />
            Food Ordering System
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <FaHome className="me-1" /> Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/menu">
                  <FaUtensils className="me-1" /> Menu
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/track">
                  <FaTruck className="me-1" /> Track
                </Link>
              </li>

              {!isLoggedIn ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">
                      <FaUserPlus className="me-1" /> Register
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/login">
                      <FaSignInAlt className="me-1" /> Login
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">
                      <FaUserShield className="me-1" /> Admin
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/orders">
                      <FaClipboardList className="me-1" /> My Orders
                    </Link>
                  </li>

                  <li className="nav-item me-2">
                    <Link className="nav-link position-relative" to="/cart">
                      <FaShoppingCart className="me-1" /> Cart{" "}
                      <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartCount}
                      </span>
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link" to="/wishlist">
                      <FaHeart className="me-1" /> Wishlist
                    </Link>
                  </li>

                  <li className="nav-item dropdown">
                    <Link
                      className="nav-link dropdown-toggle"
                      to="#"
                      role="button"
                      data-bs-toggle="dropdown"
                    >
                      <FaUserCircle className="me-1" />
                      {userName}
                    </Link>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <FaUser className="me-2" />
                          Profile
                        </Link>
                      </li>

                      <li>
                        <Link className="dropdown-item" to="/settings">
                          <FaCog className="me-2" />
                          Settings
                        </Link>
                      </li>

                      <li>
                        <hr className="dropdown-divider" />
                      </li>

                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogOut}
                        >
                          <FaSignOutAlt className="me-2" />
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid px-0">{children}</div>

      <footer>
        <div className="container my-3">
          <p className="text-center py-2 text-dark">
            &copy; 2025 Sunil Kumar Shah. All Right Reserved
          </p>
        </div>
      </footer>
    </>
  );
};

export default PublicLayout;
