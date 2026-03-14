import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "../Components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";

const AdminEditUsers = () => {

  const { id } = useParams();
  const navigate = useNavigate();
  const adminUser = localStorage.getItem("adminUser");

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: ""
  });


  useEffect(() => {

    if (!adminUser) {
      navigate("/admin-login");
      return;
    }

    fetch(`http://localhost:8000/api/manipulate-users/${id}/`)
      .then((res) => res.json())
      .then((data) => {

        setFormData({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          mobile: data.mobile
        });

      })
      .catch((err) => {
        console.log("Error fetching user:", err);
      });

  }, [id, adminUser, navigate]);


  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await fetch(
        `http://localhost:8000/api/manipulate-users/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {

        toast.success("User updated successfully");

        setTimeout(() => {
          navigate("/manage-users");
        }, 1500);

      } else {

        toast.error(data.error || "Update failed");

      }

    } catch (error) {

      console.log(error);
      toast.error("Server error");

    }

  };


  return (
    <>
      <AdminLayout>

        <div className="p-4 text-center text-success shadow-sm rounded">
          <h4>
            <i className="fas fa-user-edit me-2"></i>Edit User
          </h4>
        </div>


        <form onSubmit={handleSubmit}>

          <label className="form-label mt-3">First Name</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            className="form-control"
          />


          <label className="form-label mt-3">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            className="form-control"
          />


          <label className="form-label mt-3">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />


          <label className="form-label mt-3">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className="form-control"
          />


          <div className="row mt-3">
            <div className="col-8 mx-auto">
              <button className="btn btn-success w-100">
                Update User
              </button>
            </div>
          </div>

        </form>

        <ToastContainer position="top-center" autoClose={2000} />

      </AdminLayout>
    </>
  );
};

export default AdminEditUsers;