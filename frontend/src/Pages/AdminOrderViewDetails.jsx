import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminOrderViewDetails = () => {
  const userId = localStorage.getItem("userId");
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate=useNavigate()
  const {order_number}=useParams()
  
  return (
    <AdminLayout>

    </AdminLayout>
  )
}

export default AdminOrderViewDetails