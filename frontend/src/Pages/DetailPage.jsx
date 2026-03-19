import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useCartCount } from "../Context/CartContext"; 
import { useFetch } from "../CustomHook/useFetch";

const DetailPage = () => {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const userId = localStorage.getItem("userId");
  const [foodItem, setFood] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();
  const [addedToCart,setAddedToCart]=useState(false)
  const { cartCount, setCartCount } = useCartCount();
  const { data: cartData, loading } = useFetch(
    `${BASEURL}/api/cart/${userId}`
  );
  
  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/food/${id}`);
        const data = await response.json();
        setFood(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [id]);

  const handleAddToCart = async () => {
    if (!userId) {
      navigate("/login");
      return 0;
    }
    try {
      const response = await fetch("http://localhost:8000/api/cart/add/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          foodId: foodItem.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || "Item added successfully");
        setAddedToCart(true)
        setCartCount(cartCount+1)
        
      } else {
        toast.error(data.error || "Unable to Add to Cart");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  useEffect(() => {

    if (!cartData) return;
  
    const exists = cartData.some(
      (item) => item.food.id === Number(id)
    );
  
    if (exists) {
      setAddedToCart(true);
    }
  
  }, [cartData, id]);
  return (
    <>
      <PublicLayout>
        <ToastContainer className="text-center" />
        <div className="container">
          <div className="row my-4 shadow-lg p-4 align-items-center">
            <div className="col-md-5 text-center">
              <Zoom>
                <img
                  src={`${BASEURL}/${foodItem.image}`}
                  alt={foodItem.item_name}
                  className="img-fluid rounded-3"
                  style={{ maxHeight: "300px", objectFit: "cover" }}
                />
              </Zoom>
            </div>

            <div className="col-md-7 text-primary">
              <h2>{foodItem.item_name}</h2>

              <p className="text-muted">{foodItem.item_description}...</p>

              <p>
                <strong className="me-1">Category :</strong>
                {foodItem.category_name}
              </p>

              <h4>Price: Rs {foodItem.item_price}</h4>

              <p>
                Shipping: <strong>Free</strong>
              </p>
               <div>
               {foodItem.is_available ? (
                <button
                  className={`btn ${addedToCart?"btn-success" :"btn-outline-primary"}`}
                  onClick={handleAddToCart}
                  disabled={addedToCart}
                >
                  <i className="fas fa-shopping-cart me-2"></i>
                  {addedToCart?"Added to Cart":"Add to cart"}
                </button>
              ) : (
                <button className="btn btn-outline-danger">
                  <i className="fas fa-times-circle me-2"></i>
                  Not Available
                </button>
              )}
                {userId && (
                  <>
                  <button className="btn btn-primary ms-3"
                  onClick={()=> navigate("/cart")}>
                    <i className="fas fa-eye me-2"></i>
                    View Cart
                  </button>
                  </>
                )}
               </div>
            
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export default DetailPage;
