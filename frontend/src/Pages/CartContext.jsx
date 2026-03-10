import { createContext,useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cartCount state
  // First check if cartCount exists in localStorage
  // If yes → convert it to Number
  // If not → default value will be 0
  const [cartCount, setCartCount] = useState(()=>{
    return Number(localStorage.getItem("cartCount"|| 0))
  });
   // useEffect runs whenever cartCount changes
  // It stores the updated cartCount into localStorage
  // This ensures the value persists even after page refresh
  useEffect(()=>{
       localStorage.setItem("cartCount",cartCount)
  },[cartCount])
  return (
    <CartContext.Provider value={{ cartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export function useCartCount(){
  return useContext(CartContext)
}