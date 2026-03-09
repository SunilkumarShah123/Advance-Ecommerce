import React from "react";
import { Link, useLocation } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { useState, useEffect } from "react";

const SearchPage = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const query = new URLSearchParams(useLocation().search).get("q");

  const [foodItems, setFood] = useState([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        if (query){
        const response = await fetch(`${BASEURL}/api/food-search/?q=${query}`);
        const data = await response.json();
        setFood(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [query]);

  return (
    <PublicLayout>
      <div className="container">
        <h2 className="text-center text-primary mt-4">
          Search Result For: "{query}"
        </h2>

        <div className="row mt-4">
          {foodItems.length === 0 ? (
            <div className="mx-auto">
              <h3 className="text-primary">No Such Product Found</h3>
            </div>
          ) : (
            foodItems.map((food) => (
              <div className="col-md-4 mb-4" key={food.id}>
                <div
                  className="card cardwrapper shadow-sm"
                  style={{ borderRadius: "8px", transition: "0.2s" }}
                >
                  <img
                    src={`${BASEURL}${food.image}`}
                    className="card-img-top"
                    alt="product"
                    style={{ height: "180px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to="#">{food.item_name}</Link>
                    </h5>

                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 50)}...
                    </p>

                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold">
                        Price: Rs.{food.item_price}
                      </span>
                     {food.is_available?(<Link to="#">
                        <button className="btn btn-outline-primary">
                          <i className="fas fa-shopping-basket me-2"></i>
                          Order
                        </button>
                      </Link>):(
                        <button className="btn btn-outline-danger">
                        <i className="fas fa-times-circle me-2"></i>
                        Not Availiable
                      </button>
                      )}
                    
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default SearchPage;