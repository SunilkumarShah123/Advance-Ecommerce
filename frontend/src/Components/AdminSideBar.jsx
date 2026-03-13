import React, { useState } from "react";
import "../Css/admin.css";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaThLarge,
  FaChevronUp,
  FaChevronDown,
  FaPlusCircle,
  FaListAlt,
  FaUtensils,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaTruck,
  FaSearch,
  FaStar,
  FaFile,
} from "react-icons/fa";

const AdminSideBar = () => {
  const [openMenu, setOpenMenu] = useState({
    category: false,
    food: false,
    Orders: false,
  });

  const toggleFunc = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="bg-dark text-light sidebar">
      <div className="text-center p-3 border-bottom">
        <img
          src="images/admin-logo.jpeg"
          className="img-fluid rounded-circle"
          alt="admin-logo"
          width="70px"
        />
        <h6 className="mt-3">Admin</h6>
      </div>

      <div className="list-group list-group-flush">
        <Link className="list-group-item list-group-item-action bg-dark text-light border-0">
          <FaThLarge className="me-2" /> Dashboard
        </Link>

        <button
          onClick={() => toggleFunc("category")}
          className="list-group-item list-group-item-action bg-dark text-light border-0"
        >
          <FaEdit className="me-2" />
          Food Item {openMenu.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {openMenu.category && (
          <div>
            <Link
              to={"/add-category"}
              className="list-group-item list-group-item-action bg-dark text-light border-0"
            >
              <FaPlusCircle className="me-2" /> Add Category
            </Link>
            <Link
              to={"/manage-category"}
              className="list-group-item list-group-item-action bg-dark text-light border-0"
            >
              <FaListAlt className="me-2" /> Manage Category
            </Link>
          </div>
        )}

        <button
          onClick={() => toggleFunc("food")}
          className="list-group-item list-group-item-action bg-dark text-light border-0"
        >
          <FaUtensils className="me-2" />
          Food Menu {openMenu.food ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMenu.food && (
          <div>
            <Link
              to={"/add-food-item"}
              className="list-group-item list-group-item-action bg-dark text-light border-0"
            >
              <FaPlusCircle className="me-2" /> Add Food Item
            </Link>
            <Link
              to={"/manage-food-item"}
              className="list-group-item list-group-item-action bg-dark text-light border-0"
            >
              <FaListAlt className="me-2" /> Manage Food Item
            </Link>
          </div>
        )}

        <button
          onClick={() => toggleFunc("Orders")}
          className="list-group-item list-group-item-action bg-dark text-light border-0"
        >
          <FaEdit className="me-2" />
          Order {openMenu.Orders ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        {openMenu.Orders && (
          <div>
            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/not-confirmed"
            >
              <FaClock className="me-2" /> Not Confirmed
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/confirmed"
            >
              <FaCheckCircle className="me-2" /> Confirmed
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/preparing"
            >
              <FaUtensils className="me-2" /> Being Prepared
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/pickup"
            >
              <FaTruck className="me-2" /> Food Pickup
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/delivered"
            >
              <FaCheckCircle className="me-2" /> Delivered
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/cancelled"
            >
              <FaTimesCircle className="me-2" /> Cancelled
            </Link>

            <Link
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              to="/admin/orders/all"
            >
              <FaListAlt className="me-2" /> All Orders
            </Link>
          </div>
        )}

        <Link className="list-group-item list-group-item-action bg-dark text-light border-0" to="/between-dates-report">
          <FaFile className="me-2" /> B/W Dates Report
        </Link>
        <Link className="list-group-item list-group-item-action bg-dark text-light border-0">
          <FaSearch className="me-2" /> Search
        </Link>

        <Link className="list-group-item list-group-item-action bg-dark text-light border-0">
          <FaStar className="me-2" /> Manage Reviews
        </Link>
      </div>
    </div>
  );
};

export default AdminSideBar;
