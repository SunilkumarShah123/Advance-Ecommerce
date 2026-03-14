import { Routes, Route } from "react-router-dom";

// =========================
// Public Pages
// =========================
import Home from "./Pages/Home";
import SearchPage from "./Pages/SearchPage";
import DetailPage from "./Pages/DetailPage";

// =========================
// Authentication
// =========================
import Register from "./Components/Register";
import Login from "./Components/Login";

// =========================
// Cart & Order (User Side)
// =========================
import Cart from "./Pages/Cart.jsx";
import Payment from "./Pages/Payment.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import SingleOrderDetail from "./Pages/SingleOrderDetail.jsx";

// =========================
// User Profile Management
// =========================
import Profile from "./Pages/Profile.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";

// =========================
// Admin Authentication
// =========================
import AdminLogin from "./Pages/AdminLogin";

// =========================
// Admin Dashboard & Management
// =========================
import AdminDashboard from "./Pages/AdminDashboard";
import AddCategory from "./Pages/AddCategory";
import ManageCategory from "./Pages/ManageCategory";
import AddFood from "./Pages/AddFood";
import ManageFood from "./Pages/ManageFood";

// =========================
// Admin Order Management
// =========================
import OrdersNotConfirmed from "./Pages/OrdersNotConfirmed.jsx";
import ConfirmedOrders from "./Pages/ConfirmedOrders";
import FoodBeingPrepared from "./Pages/FoodBeingPrepared";
import FoodPickup from "./Pages/FoodPickup";
import FoodDelivered from "./Pages/FoodDelivered";
import CancelledOrders from "./Pages/CancelledOrders";
import AllOrders from "./Pages/AllOrders";
import BetweenDatesReport from "./Pages/BetweenDatesReport.jsx";
import AdminOrderViewDetails from "./Pages/AdminOrderViewDetails.jsx";
import AdminSearchOrderPage from "./Pages/AdminSearchOrderPage.jsx";
import EditCategory from "./Pages/EditCategory.jsx";
import EditFood from "./Pages/EditFood.jsx";
import AdminEditUsers from "./Pages/AdminEditUsers.jsx";
import ManageUsers from "./Pages/ManageUsers.jsx";

const App = () => {
  return (
    <Routes>

      {/* =========================
          Public Pages
      ========================= */}
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/food/:id" element={<DetailPage />} />


      {/* =========================
          Authentication
      ========================= */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />


      {/* =========================
          Cart & Orders (User)
      ========================= */}
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route path="/order-details/:order_number" element={<SingleOrderDetail />} />


      {/* =========================
          User Profile
      ========================= */}
      <Route path="/profile" element={<Profile />} />
      <Route path="/changepassword" element={<ChangePassword />} />


      {/* =========================
          Admin Authentication
      ========================= */}
      <Route path="/admin-login" element={<AdminLogin />} />


      {/* =========================
          Admin Dashboard & Management
      ========================= */}
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/manage-category" element={<ManageCategory />} />
      <Route path="/edit-category/:id" element={<EditCategory />} />
      <Route path="/add-food-item" element={<AddFood />} />
      <Route path="/manage-food-item" element={<ManageFood />} />
      <Route path="/edit-food-item/:id" element={<EditFood />} />
      <Route path="/manage-register-user" element={<ManageUsers />} />
      <Route path="/edit-register-user/:id" element={<AdminEditUsers />} />

     
      {/* =========================
          Admin Order Management
      ========================= */}
      <Route path="/admin/orders/not-confirmed" element={<OrdersNotConfirmed />} />
      <Route path="/admin/orders/confirmed" element={<ConfirmedOrders />} />
      <Route path="/admin/orders/preparing" element={<FoodBeingPrepared />} />
      <Route path="/admin/orders/pickup" element={<FoodPickup />} />
      <Route path="/admin/orders/delivered" element={<FoodDelivered />} />
      <Route path="/admin/orders/cancelled" element={<CancelledOrders />} />
      <Route path="/admin/orders/all" element={<AllOrders />} />
      <Route path="/between-dates-report" element={<BetweenDatesReport />} />
      <Route path="/admin/order-detail/:order_number" element={<AdminOrderViewDetails />} />
      <Route path="/admin/search-order" element={<AdminSearchOrderPage />} />


    </Routes>
  );
};

export default App;