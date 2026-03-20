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
  const [addedToCart, setAddedToCart] = useState(false);
  const { cartCount, setCartCount } = useCartCount();
  const { data: cartData } = useFetch(`${BASEURL}/api/cart/${userId}`);
  const [review, setReview] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredColorRating, setHoveredColoredRating] = useState(0);
  const [reviewEditId, setReviewEditId] = useState(null);
  console.log("login user id",userId)
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
    const fetchFoodRating = async () => {
      try {
        const response = await fetch(`${BASEURL}/api/review/${id}`);
        const data = await response.json();
        console.log(data)
        setReview(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFoodRating();
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
        setAddedToCart(true);
        setCartCount(cartCount + 1);
      } else {
        toast.error(data.error || "Unable to Add to Cart");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      toast.warning("PLease Login to Submit Review");
      navigate("/login");
      return 0;
    }

    const review_payload_data = {
      userId: userId,
      foodId: id,
      rating: rating,
      comment: comment,
    };

    const url = reviewEditId
      ? `http://localhost:8000/api/review/edit/${reviewEditId}/`
      : `http://localhost:8000/api/review/add/${id}/`;

    const method = reviewEditId ? "PUT" : "POST";
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(review_payload_data),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          reviewEditId
            ? "Review Updated Successfully"
            : "Review Added Succesfully",
        );
        setComment("");
        setRating(0);
        setReviewEditId(null);
        const updatedReview = await fetch(
          `http://localhost:8000/api/review/${id}/`,
        );
        const updatedReviewData = await updatedReview.json();
        setReview(updatedReviewData);
      } else {
        toast.error(data.error || "Unable to Add the Review");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
    }
  };

  const fetchReview = async () => {
    const response = await fetch(`http://localhost:8000/api/review/${id}/`);
    const data = await response.json();
    setReview(data);
  };

  const handleDeleteReview = async (id) => {
    const confirmDelete = window.confirm(
      "Do you really want to delete the review ?",
    );
    if (!confirmDelete) {
      return;
    }
    const response = await fetch(
      `http://localhost:8000/api/review/delete/${id}/`,
      { method: "DELETE" },
    );
    const data = await response.json();
    if (response.ok) {
      toast.success(data.msg || "Review Delete successfully");
      fetchReview();
    } else {
      toast.error(data.error || "Failed to delete the review");
    }
  };

  const RenderStars = (fetchedStarCount, clickable = false) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`fa-star ${
            i <= (hoveredColorRating || fetchedStarCount)
              ? "fas text-warning"
              : "far text-secondary"
          }`}
          style={{
            cursor: clickable ? "pointer" : "default",
            fontSize: "20px",
            marginRight: "4px",
          }}
          onClick={clickable ? () => setRating(i) : undefined}
          onMouseEnter={
            clickable ? () => setHoveredColoredRating(i) : undefined
          }
          onMouseLeave={
            clickable ? () => setHoveredColoredRating(0) : undefined
          }
        ></i>,
      );
    }

    return stars;
  };

  const handleEditReview = (rav) => {
    setRating(rav.rating);
    setComment(rav.comment);
    setReviewEditId(rav.id);
  };

  useEffect(() => {
    if (!cartData) return;
    const exists = cartData.some((item) => item.food.id === Number(id));
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
                    className={`btn ${addedToCart ? "btn-success" : "btn-outline-primary"}`}
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                  >
                    <i className="fas fa-shopping-cart me-2"></i>
                    {addedToCart ? "Added to Cart" : "Add to cart"}
                  </button>
                ) : (
                  <button className="btn btn-outline-danger">
                    <i className="fas fa-times-circle me-2"></i>
                    Not Available
                  </button>
                )}
                {userId && (
                  <>
                    <button
                      className="btn btn-primary ms-3"
                      onClick={() => navigate("/cart")}
                    >
                      <i className="fas fa-eye me-2"></i>
                      View Cart
                    </button>
                  </>
                )}
              </div>
            </div>
            <hr className="mt-4" />

            <div className="mt-2">
              <h4 className="mb-2">Customer Reviews</h4>

              {review.length === 0 ? (
                <p className="text-muted fst-italic">
                  No Reviews Yet. Be first to share thoughts regarding product
                </p>
              ) : (
                review.map((rev, index) => (
                  <div key={index} className="mt-3 border-bottom pb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{rev.user_name}</strong>
                        <span className="ms-2">{RenderStars(rev.rating)}</span>

                        <div className="mt-1">
                          <p className="mb-1">{rev.comment}</p>
                          <small className="text-muted">
                            {new Date(rev.created_at).toLocaleString()}
                          </small>
                        </div>
                      </div>

                      {rev.user_id === parseInt(userId) && (
                        <div>
                          <i
                            className="fas fa-edit text-primary me-2"
                            style={{ cursor: "pointer", fontSize: "17px" }}
                            onClick={() => handleEditReview(rev)}
                          ></i>

                          <i
                            className="fas fa-trash text-danger"
                            style={{ cursor: "pointer", fontSize: "17px" }}
                            onClick={() => handleDeleteReview(rev.id)}
                          ></i>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-5">
              <h5>
                <i className="fas fa-pen me-1"></i>{" "}
                {reviewEditId ? "Edit Review" : "Write a Review"}
              </h5>

              <div className="my-3">
                <label className="form-label fw-semibold">Your Rating</label>
                <div className="mt-2">{RenderStars(rating, true)}</div>
              </div>

              <div className="my-3">
                <label htmlFor="comment" className="form-label fw-semibold">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="form-control"
                  placeholder="Enter your review here..."
                  id="comment"
                  rows="3"
                ></textarea>

                <button
                  className="btn btn-success mt-3"
                  onClick={handleSubmitReview}
                  disabled={!rating || !comment}
                >
                  <i className="fas fa-paper-plane me-1"></i>
                  {reviewEditId ? "Update Review" : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </PublicLayout>
    </>
  );
};

export default DetailPage;
