import React, { useEffect, useState } from "react";
import PublicLayout from "../Components/PublicLayout";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useWishListCount } from "../Context/WishListContext";
import "react-toastify/dist/ReactToastify.css";

const WishList = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const userId = localStorage.getItem("userId");

  const [wishListItems, setWishListItems] = useState([]);
  const { setWishListCount } = useWishListCount();

  const fetchWishList = async () => {
    try {
      const res = await fetch(`${BASEURL}/api/get-wish-list/${userId}/`);
      const data = await res.json();

      setWishListItems(data);
      setWishListCount(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchWishList();
    }
  }, [userId]);

  // ✅ REMOVE ONLY
  const removeFromWishList = async (foodId) => {
    try {
        const response = await fetch(`${BASEURL}/api/wishlist/remove/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: Number(userId),   
              foodId: Number(foodId),   
            }),
          });
      const data = await response.json();

      if (response.status === 200) {
        // remove locally
        setWishListItems((prev) =>
          prev.filter((item) => item.food_id !== foodId)
        );
        const updatedCount=await fetch(`http://localhost:8000/api/get-wish-list/${userId}/`)
        const updatedWishListCount= await updatedCount.json()
        setWishListCount(updatedWishListCount.length)

        toast.success(data.msg || "Removed from wishlist");
      } else {
        toast.error("Error removing item");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <PublicLayout>
      <ToastContainer />

      <div className="container mt-5 pt-4">
        <h2 className="text-center text-danger mb-4">
          ❤️ Your Wishlist
        </h2>

        <div className="row">
          {wishListItems.length === 0 ? (
            <div className="text-center">
              <h4>No items in wishlist</h4>
            </div>
          ) : (
            wishListItems.map((item,index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card shadow-sm">

                  <div className="position-relative">
                    <Link to={`/food/${item.food_id}`}>
                      <img
                        src={`${BASEURL}${item.image}`}
                        className="card-img-top"
                        alt="food"
                        style={{ height: "180px", objectFit: "cover" }}
                      />
                    </Link>

                    {/* ❤️ REMOVE ONLY */}
                    <i
                      className="fas fa-heart position-absolute text-danger d-flex align-items-center justify-content-center"
                      style={{
                        top: "10px",
                        right: "10px",
                        width: "35px",
                        height: "35px",
                        backgroundColor: "white",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => removeFromWishList(item.food_id)}
                    ></i>
                  </div>

                  <div className="card-body">
                    <h5>
                      <Link
                        to={`/food/${item.food_id}`}
                        className="text-decoration-none"
                      >
                        {item.item_name}
                      </Link>
                    </h5>

                    <p className="text-muted">
                      {item.description?.slice(0, 50)}...
                    </p>

                    <div className="d-flex justify-content-between">
                      <span>Rs. {item.item_price}</span>

                      <button className="btn btn-outline-primary">
                        Order
                      </button>
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

export default WishList;