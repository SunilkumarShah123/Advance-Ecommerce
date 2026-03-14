import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CSVLink } from "react-csv";
import AdminLayout from "../Components/AdminLayout";

const ManageFood = () => {
  const [foodList, setFoodList] = useState([]);
  const [searchFoodList, setSearchFoodList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/get-food-items/")
      .then((res) => res.json())
      .then((data) => {
        setFoodList(data);
        setSearchFoodList(data);
      })
      .catch((e) => {
        console.error("Error fetching categories:", e);
      });
  }, []);

  const handleSearch = (search) => {
    const keyword = search.toLowerCase();

    if (!keyword) {
      setFoodList(searchFoodList);
    } else {
      const filterData = searchFoodList.filter((food) =>
        food.item_name.toLowerCase().includes(keyword)
      );
      setFoodList(filterData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the Food ?")){
      fetch(`http://localhost:8000/api/manipulate-food/${id}/`, {
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
        <div>
          <h2 className="text-center p-3 text-primary shadow-sm">
            <i className="fas fa-list-alt me-2"></i>Manage Food Items
          </h2>
        </div>

        <div>
          <div>
            <h5 className="text-end text-muted mb-2">
              <i className="fas fa-database me-2"></i>Total Food Items
              <span className="badge bg-success ms-2 ">
                {foodList.length}
              </span>

              <div className="d-flex mt-2">
                <input
                  className="form-control w-50 mb-0"
                  type="text"
                  placeholder="Enter the category name"
                  onChange={(e) => handleSearch(e.target.value)}
                />

                <CSVLink
                  data={foodList}
                  filename={"category-list.csv"}
                  className="btn btn-success ms-auto"
                >
                  <i className="fas fa-file-csv"></i> Export Csv
                </CSVLink>
              </div>
            </h5>
          </div>

          <div>
            <table className="table table-bordered table-hover text-center">
              <thead className="table-dark">
                <tr>
                  <th>S.No</th>
                  <th>Category Name</th>
                  <th>Food Item Name</th>
                  <th>Availiable</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {foodList.length <= 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      <h5>Items Doesn't Exist</h5>
                    </td>
                  </tr>
                ) : (
                  foodList.map((food, index) => (
                    <tr key={food.id}>
                      <td>{index + 1}</td>
                      <td>{food.category_name}</td>
                      <td>{food.item_name}</td>

                      <td>{food.is_available?"Yes":"No"}</td>
                      <td>
                        <Link to={`/edit-food-item/${food.id}/`} className="btn btn-sm btn-primary me-2">
                          <i className="fas fa-edit me-1"></i>Edit
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={()=>(handleDelete(food.id))}>
                          <i className="fas fa-trash me-1"></i>Delete
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

export default ManageFood;