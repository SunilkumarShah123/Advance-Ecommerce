import React, { useEffect, useState } from "react";
import PublicLayout from "../Components/PublicLayout";
import { Link } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const FoodList = () => {
  const [foodItems, setFoods] = useState([]);
  const [filtereItems, setFilteredItems] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryList, setCategoriesList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);

  const foodsPerPage = 3;
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  // Fetch food items
  useEffect(() => {
    fetch(`${BASEURL}/api/get-food-items`)
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setFilteredItems(data);
      });
  }, []);

  console.log(foodItems[0]);
  // Fetch categories
  useEffect(() => {
    fetch(`${BASEURL}/api/get-categories`)
      .then((res) => res.json())
      .then((data) => setCategoriesList(data));
  }, []);
  console.log(selectedCategory);
  // Apply filters
  const applyFilters = () => {
    let result = foodItems;

    // Search filter
    if (search) {
      result = result.filter((item) =>
        item.item_name?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // Category filter based on category id not category name
    if (selectedCategory !== "All") {
      result = result.filter(
        (item) => item.category_name === selectedCategory
      );
    }
  
  
    // Price filter
    result = result.filter(
      (item) =>
        Number(item.item_price) >= minPrice &&
        Number(item.item_price) <= maxPrice,
    );

    setFilteredItems(result);
    setCurrentPage(1);
  };

  // Auto trigger filters
  useEffect(() => {
    applyFilters();
  }, [search, selectedCategory, minPrice, maxPrice, foodItems]);

  // Pagination
  const indexOfLastFood = currentPage * foodsPerPage;
  const indexOfFirstFood = indexOfLastFood - foodsPerPage;
  const currentFoodItemsOnCurrentPage = filtereItems.slice(
    indexOfFirstFood,
    indexOfLastFood,
  );
  const totalPages = Math.ceil(filtereItems.length / foodsPerPage);

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <PublicLayout>
      <div className="container py-3">
        <h3 className="text-center mt-3 text-secondary">
          Find Your Delicious Food Item Here ....
        </h3>

        <div className="row">
          <div className="col-md-8">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary">Search</button>
            </div>
          </div>

          <div className="col-md-4">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="form-select"
            >
              <option value="All">All</option>
              {categoryList.map((category, index) => (
                <option key={index} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Filter */}
        <div className="row my-4">
          <div className="col-md-12 text-primary">
            <h5>
              Filter By Price: Rs {minPrice} - Rs {maxPrice}
            </h5>
            <Slider
              range
              min={0}
              max={500}
              value={[minPrice, maxPrice]}
              onChange={(rangeValue) => {
                setMinPrice(rangeValue[0]);
                setMaxPrice(rangeValue[1]);
              }}
            />
          </div>
        </div>

        {/* Food List */}
        <div className="row mt-4">
          {currentFoodItemsOnCurrentPage.length === 0 ? (
            <div className="text-center">
              <h3 className="text-primary">No Such Product Found</h3>
            </div>
          ) : (
            currentFoodItemsOnCurrentPage.map((food) => (
              <div className="col-md-4 mb-4" key={food.id}>
                <div className="card shadow-sm">
                  <Link to={`/food/${food.id}`}>
                    <img
                      src={`${BASEURL}${food.image}`}
                      className="card-img-top"
                      alt="product"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                  </Link>
                  <div className="card-body">
                    <h5>
                      <Link to={`/food/${food.id}`} className="text-decoration-none">{food.item_name}</Link>
                    </h5>
                    <p>{food.item_description?.slice(0, 50)}...</p>
                    <div className="d-flex justify-content-between">
                      <span>Rs. {food.item_price}</span>
                      {food.is_available ? (
                        <button className="btn btn-outline-primary">
                          Order
                        </button>
                      ) : (
                        <button className="btn btn-outline-danger">
                          Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="row mt-5">
          {totalPages > 1 && (
            <div className="col-md-12 d-flex justify-content-center">
              <nav className="">
                <ul className="pagination ">
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  
                  >
                    <button className="page-link"     onClick={() => setCurrentPage(1)}>First</button>
                  </li>
                  <li
                    className={`page-item ${currentPage === 1 && "disabled"}`}
                  >
                    <button className="page-link"  onClick={() => setCurrentPage(currentPage - 1)}>Pre</button>
                  </li>
                  <li className="page-item">
                    <span className="page-link disabled">
                      Page {currentPage} of {totalPages}
                    </span>
                  </li>
                  <li
                    className={`page-item ${currentPage === totalPages && "disabled"}`}
                  >
                    <button className="page-link"  onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                  </li>
                  <li
                    className={`page-item ${currentPage === totalPages && "disabled"}`}
                  
                  >
                    <button className="page-link"     onClick={() => setCurrentPage(totalPages)}>Last</button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodList;
