import Home from "./Pages/Home";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";
import AddCategory from "./Pages/AddCategory";
import { Routes, Route } from "react-router-dom";
import ManageCategory from "./Pages/ManageCategory";
import AddFood from "./Pages/AddFood";
import ManageFood from "./Pages/ManageFood";
import SearchPage from "./Pages/SearchPage";
import Register from "./Components/Register";
import Login from "./Components/Login";
import DetailPage from "./Pages/DetailPage";
import Cart from "./Pages/Cart.jsx";
import Payment from "./Pages/Payment.jsx";
import MyOrders from "./Pages/MyOrders.jsx";
import SingleOrderDetail from "./Pages/SingleOrderDetail.jsx";
import Profile from "./Pages/Profile.jsx";
import ChangePassword from "./Pages/ChangePassword.jsx";
import OrdersNotConfirmed from "./Pages/OrdersNotConfirmed.jsx";
import ConfirmedOrders from "./Pages/ConfirmedOrders";
import FoodBeingPrepared from "./Pages/FoodBeingPrepared";
import FoodPickup from "./Pages/FoodPickup";
import FoodDelivered from "./Pages/FoodDelivered";
import CancelledOrders from "./Pages/CancelledOrders";
import AllOrders from "./Pages/AllOrders";
import BetweenDatesReport from "./Pages/BetweenDatesReport.jsx";
import AdminOrderViewDetails from "./Pages/AdminOrderViewDetails.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
      <Route path="/add-category" element={<AddCategory />} />
      <Route path="/manage-category" element={<ManageCategory />} />
      <Route path="/add-food-item" element={<AddFood />} />
      <Route path="/manage-food-item" element={<ManageFood />} />

      <Route
        path="admin/orders/not-confirmed"
        element={<OrdersNotConfirmed />}
      />
      <Route path="/admin/orders/confirmed" element={<ConfirmedOrders />} />
      <Route path="/admin/orders/preparing" element={<FoodBeingPrepared />} />
      <Route path="/admin/orders/pickup" element={<FoodPickup />} />
      <Route path="/admin/orders/delivered" element={<FoodDelivered />} />
      <Route path="/admin/orders/cancelled" element={<CancelledOrders />} />
      <Route path="/admin/orders/all" element={<AllOrders />} />
      <Route path="/between-dates-report" element={<BetweenDatesReport />} />
      <Route path="/admin/order-detail/:order_number" element={<AdminOrderViewDetails />} />


      <Route path="/search" element={<SearchPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/food/:id" element={<DetailPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/my-orders" element={<MyOrders />} />
      <Route
        path="/order-details/:order_number"
        element={<SingleOrderDetail />}
      />
      <Route path="/profile" element={<Profile />} />
      <Route path="/changepassword" element={<ChangePassword />} />
    </Routes>
  );
};

export default App;
