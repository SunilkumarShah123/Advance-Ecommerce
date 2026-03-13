import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import { FaUser, FaUserEdit } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Profile = () => {
  const userId = localStorage.getItem("userId");
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    reg_date: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/user/${userId}/`);
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProfile();
  }, [userId, navigate, BASEURL]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BASEURL}/api/user/update/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: profile.first_name,
          last_name: profile.last_name,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.msg || "Profile Updated Successfully");
      } else {
        toast.error(result.error || "Something went wrong!");
      }
    } catch (error) {
      console.log("Server error", error);
    }
  };

  return (
    <PublicLayout>
      <ToastContainer />

      <div className="container py-5">

        <h2 className="text-center my-3">
          <FaUser className="me-2 text-primary" />
          Profile
        </h2>

        <div className="card shadow-sm p-4">

          <form onSubmit={handleProfileSubmit}>
            <div className="row">

              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="first_name"
                  value={profile.first_name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="last_name"
                  value={profile.last_name}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 mt-3">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="col-md-6 mt-3">
                <label className="form-label">Mobile</label>
                <input
                  type="text"
                  className="form-control"
                  value={profile.mobile}
                  disabled
                />
              </div>

              <div className="col-md-6 mt-3">
                <label className="form-label">Registered Date</label>
                <input
                  type="text"
                  className="form-control"
                  value={new Date(profile.reg_date).toLocaleDateString()}
                  disabled
                />
              </div>

              <div className="col-12 mt-4">
                <button className="btn btn-primary w-100">
                  <FaUserEdit className="me-2" />
                  Update Profile
                </button>
              </div>

            </div>
          </form>

        </div>

      </div>
    </PublicLayout>
  );
};

export default Profile;