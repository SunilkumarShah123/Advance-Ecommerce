import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import AdminLayout from "../Components/AdminLayout";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

const ManageCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  const [searchCategoryList, setSearchCategoryList] = useState([]);
  useEffect(() => {
    fetch("http://localhost:8000/api/get-categories/")
      .then((res) => res.json())
      .then((data) => {
        setCategoryList(data);
        setSearchCategoryList(data);
      })

      .catch((e) => {
        console.error("Error fetching categories:", e);
      });
  }, []);
  const handleSearch = (search) => {
    const keyword = search.toLowerCase();
    if (!keyword) {
      setCategoryList(searchCategoryList);
    } else if (keyword) {
      const filterData = categoryList.filter((cate) =>
        cate.category_name.toLowerCase().includes(keyword),
      );
      setCategoryList(filterData);
    } else {
      setCategoryList("");
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the cateogry?")){
      fetch(`http://localhost:8000/api/manipulate-category/${id}/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          toast.success(data.msg || "Deleted successfully");
          setCategoryList(categoryList.filter((item)=> item.id !== id))
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
        <ToastContainer className="text-center"/>
        <div>
          <h2 className="text-center p-3 text-primary shadow-sm">
            <i className="fas fa-list-alt me-2"></i>Manage Category
          </h2>
        </div>
        <div>
          <div>
            <h5 className="text-end text-muted mb-2">
              <i className="fas fa-database me-2"></i>Total Categories
              <span className="badge bg-success ms-2 ">
                {categoryList.length}
              </span>
              <div className="d-flex mt-2">
                <input
                  className="form-control w-50 mb-0"
                  type="text"
                  placeholder="Enter the category name"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <CSVLink
                  data={categoryList}
                  filename={"category-list.csv"}
                  className="btn btn-success ms-auto"
                >
                  <i className="fas fa-file-csv"></i> Export Csv
                </CSVLink>
              </div>
            </h5>
          </div>
          <div>
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Category Name</th>
                  <th>Creation Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.length <= 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <h5>Items Doesn't Exist</h5>
                    </td>
                  </tr>
                ) : (
                  categoryList.map((category, index) => (
                    <tr key={category.id}>
                      <td>{index + 1}</td>
                      <td>{category.category_name}</td>
                      <td>
                        {new Date(category.creation_date).toLocaleString()}
                      </td>
                      <td>
                        <Link to={`/edit-category/${category.id}/`} className="btn btn-sm btn-primary me-2">
                          <i className="fas fa-edit me-1"></i>Edit
                        </Link>
                        <button className="btn btn-sm btn-danger"   onClick={()=>(handleDelete(category.id))} >
                          <i className="fas fa-trash me-1"></i>
                        </button>
                      </td>
                     
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
};

export default ManageCategory;
