import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Css/Dashboard.css";
import BarGraph from "../Components/DashBoardCharts/BarGraph";
import { TopSalesTable } from "../Components/DashBoardCharts/TopSalesTable";
import WeeklySalesSummary from "../Components/DashBoardCharts/WeeklySalesSummary";
import WeeklyRegisterUser from "../Components/DashBoardCharts/WeeklyRegisterUser";

const AdminDashboard = () => {
  const adminUser = localStorage.getItem("adminUser");
  const navigate = useNavigate();

  const [metrices, setMetrices] = useState({
    total_orders: 0,
    new_orders: 0,
    confirmed_orders: 0,
    food_preparing: 0,
    food_pickup: 0,
    food_delivered: 0,
    cancelled_orders: 0,
    total_users: 0,
    total_categories: 0,
    total_reviews: 0,
    total_wishlists: 0,
    week_sales: 0,
    month_sales: 0,
    year_sales: 0,
    today_sales: 0,
  });

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch("http://localhost:8000/api/dashboard/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return res.json();
      })
      .then((data) => {
        setMetrices(data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [adminUser, navigate]);

  const dashContent = [
    {
      title: "Total Orders",
      key: "total_orders",
      color: "primary",
      icon: "fas fa-shopping-cart",
    },
    {
      title: "New Orders",
      key: "new_orders",
      color: "secondary",
      icon: "fas fa-cart-plus",
    },
    {
      title: "Confirmed Orders",
      key: "confirmed_orders",
      color: "info",
      icon: "fas fa-check-circle",
    },
    {
      title: "Food Being Prepared",
      key: "food_preparing",
      color: "warning",
      icon: "fas fa-utensils",
    },
    {
      title: "Food Pickup",
      key: "food_pickup",
      color: "dark",
      icon: "fas fa-motorcycle",
    },
    {
      title: "Food Delivered",
      key: "food_delivered",
      color: "success",
      icon: "fas fa-box-open",
    },
    {
      title: "Cancelled Orders",
      key: "cancelled_orders",
      color: "danger",
      icon: "fas fa-times-circle",
    },
    {
      title: "Total Users",
      key: "total_users",
      color: "primary",
      icon: "fas fa-users",
    },
    {
      title: "Total Categories",
      key: "total_categories",
      color: "secondary",
      icon: "fas fa-list",
    },
    {
      title: "Total Reviews",
      key: "total_reviews",
      color: "warning",
      icon: "fas fa-star",
    },
    {
      title: "Total Wishlists",
      key: "total_wishlists",
      color: "danger",
      icon: "fas fa-heart",
    },
    {
      title: "Today's Sales",
      key: "today_sales",
      color: "info",
      icon: "fas fa-money-bill-wave",
    },
    {
      title: "Weekly Sales",
      key: "week_sales",
      color: "success",
      icon: "fas fa-chart-line",
    },
    {
      title: "Monthly Sales",
      key: "month_sales",
      color: "warning",
      icon: "fas fa-calendar-alt",
    },
    {
      title: "Yearly Sales",
      key: "year_sales",
      color: "dark",
      icon: "fas fa-coins",
    },
  ];

  return (
    <AdminLayout>
      <div className="row py-1 g-3">
        {dashContent.map((item, index) => (
          <div className="col-md-3" key={index}>
            <div className={`card card-hover bg-${item.color} text-light`}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title">{item.title}</h5>
                  <h2>
                    {item.key === "week_sales" ||
                    item.key === "month_sales" ||
                    item.key === "year_sales" ||
                    item.key === "today_sales"
                      ? `Rs. ${metrices[item.key]}`
                      : metrices[item.key]}
                  </h2>
                </div>

                <i className={`${item.icon} fa-2x`}></i>
              </div>
            </div>
          </div>
        ))}

        {/* Food Ordering System Card */}

        <div className="col-md-3">
          <div className="card card-hover bg-light text-center mt-1">
            <i className="fas fa-concierge-bell fa-2x text-danger mb-3"></i>

            <p className="text-dark fw-bold mb-0">
              Food Ordering <br />
              <span className="text-danger">System</span>
            </p>
          </div>
        </div>
      </div>
    
    <div className="row my-3">
      <div className="col-md-6">
      <BarGraph/>
      </div>
      <div className="col-md-6">
        <TopSalesTable/>
      </div>
    </div>

    <div className="row my-3">
      <div className="col-md-6">
      <WeeklySalesSummary/>
      </div>
      <div className="col-md-6">
        <WeeklyRegisterUser/>
      </div>
    </div>

      
    </AdminLayout>
  );
};

export default AdminDashboard;
