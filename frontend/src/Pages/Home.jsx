import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PublicLayout from "../Components/PublicLayout";
import "../Css/home.css";

const Home = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const [foodItems, setFood] = useState([]);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/random-food/`);
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, []);
  {
    /* empty [ ] in useEffect mean only render the page whenever the page reloads*/
  }
  return (
    <>
      <PublicLayout>
        <section
          className="hero py-5"
          style={{ backgroundImage: "url('/images/hero.webp')" }}
        >
          <div
            className="text-center"
            style={{
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: "40px 20px",
              borderRadius: "10px",
            }}
          >
            <h1>Quick & Hot Food, Delivered to You</h1>
            <p className="lead">
              Craving Something Tasty? Let's get it to your door!
            </p>
            <form method="GET" action="./search">
              <div className="d-flex mx-auto" style={{ maxWidth: "400px" }}>
                <input
                  className="form-control"
                  placeholder="Search Right Now . . . ."
                  name="q"
                  style={{
                    borderTopRightRadius: "0px",
                    borderBottomRightRadius: "0px",
                  }}
                  type="text"
                />
                <button
                  className="btn btn-warning py-2"
                  style={{
                    borderTopLeftRadius: "0px",
                    borderBottomLeftRadius: "0px",
                  }}
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          {/*section for randomly loading 9 items in each reload  */}
        </section>
        <div className="container">
          <h2 className="text-center mt-3 text-primary">
            Most Loved Dishes This Month{" "}
            <span className="badge bg-danger">Top Picks</span>{" "}
          </h2>

          <div className="row mt-4">
            {foodItems.length === 0 ? (
              <div className="text-center">
                <h3 className="text-primary">No Such Product Found</h3>
              </div>
            ) : (
              foodItems.map((food) => (
                <div className="col-md-4 mb-4" key={food.id}>
                  <div
                    className="card cardwrapper shadow-sm"
                    style={{ borderRadius: "8px", transition: "0.2s" }}
                  >
                    <Link to={`/food/${food.id}`}>
                    <img
                      src={`${BASEURL}${food.image}`}
                      className="card-img-top"
                      alt="product"
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    </Link>

                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={`/food/${food.id}`}>{food.item_name}</Link>
                      </h5>

                      <p className="card-text text-muted">
                        {food.item_description?.slice(0, 50)}...
                      </p>

                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold">
                          Price: Rs.{food.item_price}
                        </span>
                        {food.is_available ? (
                          <Link to="#">
                            <button className="btn btn-outline-primary">
                              <i className="fas fa-shopping-basket me-2"></i>
                              Order
                            </button>
                          </Link>
                        ) : (
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

        <section>
          <div className="container-fluid">
            <div className="row bg-dark py-3">
              <h2 className="text-white text-center py-4">
                Ordering in 3 simple steps
              </h2>
              <div className="col-md-4 text-center text-light">
                <h4>1.Pick a dish you love</h4>
                <p>
                  Explore hundreds of mouth-watering options and choose what you
                  crave!
                </p>
              </div>
              <div className="col-md-4 text-center text-light">
                <h4>2. Share your location</h4>
                <p>
                  Tell us where you are, and we'll handle the rest.Pay easily
                  with Cash on Delivery — hassle-free!
                </p>
              </div>
              <div className="col-md-4 text-center text-light">
                <h4>3. Enjoy doorstep delivery</h4>
                <p>
                  Relax while your meal arrives fast and fresh — pay when it's
                  delivered!
                </p>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container-fluid bg-warning text-center text-dark py-5">
            <h4>Ready to Satisfy Your Hunger ?</h4>
            <Link className="btn btn-dark mb-2">
            Browse Full Menu
            </Link>
          </div>
        </section>
      </PublicLayout>
    </>
  );
};

export default Home;
