import React from "react";
import { useState, useEffect } from "react";
import { useCartCount } from "../Context/CartContext";
import { useWishListCount } from "../Context/WishListContext";
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

  const { cartCount,setCartCount } = useCartCount();
  const {wishListCount,setWishListCount}=useWishListCount()

  useEffect(() => {
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name);
      fetchWishListCount()
      // fetchCount()
    }
  }, [userId]);
   
  const fetchWishListCount=async ()=>{
    if(userId){
      const res=await fetch(`http://localhost:8000/api/get-wish-list/${userId}/`)
      const data= await res.json()
      setWishListCount(data.length)
    }
    
  }

  const handleLogOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    setCartCount(0)
    setWishListCount(0)
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

              <li className="nav-item" >
                <Link className="nav-link" to="/food-list">
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
                    <Link className="nav-link" to="/my-orders">
                      <FaClipboardList className="me-1" /> My Orders
                    </Link>
                  </li>

                  <li className="nav-item me-2">
                    <Link className="nav-link position-relative" to="/cart">
                      <FaShoppingCart className="me-1" /> Cart{" "}
                      {cartCount > 0 && (
                          <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                         {cartCount}
                          </span>
                      )}
                    
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link position-relative" to="/wishlist">
                      <FaHeart className="me-1" /> Wishlist{" "}
                      {wishListCount > 0 && (
                          <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                         {wishListCount}
                          </span>
                      )}
                    
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
                        <Link className="dropdown-item" to="/changepassword">
                          <FaCog className="me-2" />
                           Change Password
                        </Link>
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
