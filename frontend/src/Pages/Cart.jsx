import { useEffect, useState } from "react";
import { useCartCount } from "../Context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../Components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCartPlus, FaMinus, FaPlus, FaTrash } from "react-icons/fa";

const Cart = () => {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const {setCartCount}=useCartCount()
  const [cartItem, setCartItem] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;


  // Fetch Cart
  const fetchCart = async () => {
    try {
      const response = await fetch(`${BASEURL}/api/cart/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setCartItem(data);
        setCartCount(data.length)
        
        const totalQty = data.reduce((sum, item) => sum + item.quantity, 0);
setCartCount(totalQty);
        const total_price = data.reduce(
          (sum, item) =>
            sum + Number(item.food.item_price) * Number(item.quantity),
          0,
        );

        setGrandTotal(total_price);
      }
    } catch (error) {
      console.log("Error during connection", error);
    }
  };

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    } else {
      fetchCart();
    }
  }, [userId, navigate]);

  // Update Quantity
  const updateQuantity = async (itemId, newQty) => {
    try {
      const response = await fetch(`${BASEURL}/api/cart/update-quantity/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          item_id: itemId,
          new_quantity: newQty,
        }),
      });

      

      if (response.ok) {
   
        fetchCart();
      }
    } catch (error) {
      console.log("Update error:", error);
    }
  };

  // Remove Item
  const removeItem = async (itemId) => {
    const confirmDelete = window.confirm("Do you want to delete this item?");

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${BASEURL}/api/cart/delete-item/${itemId}/`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.msg || "Item Removed Successfully");
        setCartCount(data.length)
        fetchCart();
      } else {
        toast.warning(data.error || "Unable to Remove Item");
      }
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  // Clear Cart
  const clearCart = async () => {
    try {
      const response = await fetch(
        `${BASEURL}/api/cart/clear-order/${userId}/`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Cart cleared successfully");
        setCartItem([]);
        setCartCount(0);
        setGrandTotal(0);
      }
    } catch (error) {
      console.log("Clear cart error:", error);
    }
  };

  return (
    <PublicLayout>
      <ToastContainer className="text-center"/>

      <div className="container py-4">
        <h3 className="mb-4 text-center text-primary">
          <FaCartPlus className="me-2" />
          YOUR CART
        </h3>

        {cartItem.length === 0 ? (
          <div className="text-center">
            <h4>No items in the cart. Go add items.</h4>

            <Link to="/" className="btn btn-primary mt-3">
              Browse Foods
            </Link>
          </div>
        ) : (
          <>
            <div className="row my-5">
              {cartItem.map((item) => (
                <div className="col-6 mb-4" key={item.id}>
                  <div className="card shadow-sm p-2">
                    <div className="row align-items-center">
                      <div className="col-4 d-flex align-items-center">
                        <img
                          src={`${BASEURL}/${item.food.image}`}
                          alt={item.food.item_name}
                          className="img-fluid rounded"
                          style={{
                            height: "120px",
                            width: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </div>

                      <div className="col-8">
                        <h6 className="mt-2">{item.food.item_name}</h6>

                        <p>
                          Price:{" "}
                          <strong className="text-success">
                            {item.food.item_price}
                          </strong>
                        </p>

                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>

                          <h5 className="mx-2">{item.quantity}</h5>

                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <button
                          className="btn btn-outline-danger my-2"
                          onClick={() => removeItem(item.id)}
                        >
                          <FaTrash className="me-1" />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div>
                <button className="btn btn-lg btn-primary" onClick={clearCart}>
                  Clear Cart
                </button>
              </div>
            </div>

            <div className="text-end mt-4 shadow-sm border card p-4">
              <h5 className="text-primary">
                Grand Total: Rs {grandTotal.toFixed(2)}
              </h5>

              <div className="my-2">
                <button className="btn btn-outline-success" onClick={()=>(navigate("/payment"))}>
                  Proceed Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </PublicLayout>
  );
};

export default Cart;
