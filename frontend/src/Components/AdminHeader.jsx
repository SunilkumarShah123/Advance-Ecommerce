import React from "react";
import { Link } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const AdminHeader = ({ toggleSideBar, openSideBar, newOrder}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };
  return (
    <>
      <nav className="navbar navbar-expand-lg border-bottom px-3 shadow-sm">
        <button className="btn btn-outline-dark me-3" onClick={toggleSideBar}>
          {openSideBar ? <FaChevronLeft /> : <FaChevronRight />}
        </button>
        <span className="navbar-brand fw-semibold">
          {" "}
          <i className="fas fa-utensils me-2"></i>Food Ordering System
        </span>
        <button className="navbar-toggler border-0 ms-auto ">
          <FaBars />
        </button>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto align-items-center gap-3">
            <li className="nav-item position-relative">
              <div>
                <Link to="/admin/orders/not-confirmed">
                <button className="btn btn-outline-secondary">
                  <FaBell />
                </button>
                <span className="position-absolute top-1 start-100 translate-middle badge rounded-pill bg-danger">
                  {newOrder}
                </span>
                </Link>
              </div>
            </li>
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-outline-danger">
                <FaSignOutAlt />
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default AdminHeader;
