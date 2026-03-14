import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import AdminLayout from "../Components/AdminLayout";
import { toast } from "react-toastify";

const ManageUsers = () => {

  const [userList, setUserList] = useState([]);
  const [searchUserList, setSearchUserList] = useState([]);

  useEffect(() => {

    fetch("http://localhost:8000/api/manage-users/")
      .then((res) => res.json())
      .then((data) => {
        setUserList(data);
        setSearchUserList(data);
      })
      .catch((e) => {
        console.error("Error fetching users:", e);
      });

  }, []);


  const handleSearch = (search) => {

    const keyword = search.toLowerCase();

    if (!keyword) {
      setUserList(searchUserList);
    } else {

      const filterData = searchUserList.filter((user) =>
        user.first_name.toLowerCase().includes(keyword) ||
        user.last_name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword)
      );

      setUserList(filterData);
    }
  };


  const handleDelete = (id) => {

    if (window.confirm("Are you sure you want to delete the user ?")) {

      fetch(`http://localhost:8000/api/manipulate-users/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {

          toast.success(data.msg || "Deleted successfully");

          setUserList(userList.filter((user) => user.id !== id));

        })
        .catch((error) => {
          toast.error("Error during deleting");
          console.log(error);
        });
    }
  };


  return (
    <>
      <AdminLayout>

        <h2 className="text-center p-3 text-primary shadow-sm">
          <i className="fas fa-users me-2"></i>Manage Users
        </h2>

        <h5 className="text-end text-muted mb-2">
          <i className="fas fa-database me-2"></i>Total Users
          <span className="badge bg-success ms-2">
            {userList.length}
          </span>

          <div className="d-flex mt-2">

            <input
              className="form-control w-50"
              type="text"
              placeholder="Search user..."
              onChange={(e) => handleSearch(e.target.value)}
            />

            <CSVLink
              data={userList}
              filename={"user-list.csv"}
              className="btn btn-success ms-auto"
            >
              <i className="fas fa-file-csv"></i> Export Csv
            </CSVLink>

          </div>
        </h5>


        <table className="table table-bordered table-hover text-center">

          <thead className="table-dark">
            <tr>
              <th>S.No</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Register Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {userList.length <= 0 ? (
              <tr>
                <td colSpan="6">
                  <h5>No Users Found</h5>
                </td>
              </tr>
            ) : (

              userList.map((user, index) => (

                <tr key={user.id}>

                  <td>{index + 1}</td>

                  <td>{user.first_name} {user.last_name}</td>

                  <td>{user.email}</td>

                  <td>{user.mobile}</td>

                  <td>{new Date(user.reg_date).toLocaleDateString()}</td>

                  <td>

                    <Link
                      to={`/edit-register-user/${user.id}/`}
                      className="btn btn-sm btn-primary me-2"
                    >
                      <i className="fas fa-edit"></i> Edit
                    </Link>

                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>

                  </td>

                </tr>

              ))
            )}

          </tbody>

        </table>

      </AdminLayout>
    </>
  );
};

export default ManageUsers;