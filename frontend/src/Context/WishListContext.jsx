import { createContext, useContext, useEffect, useState } from "react";
const wishListContext = createContext();
export const WishListProvider = ({ children }) => {
  const [wishListCount, setWishListCount] = useState(0);
  return (
    <wishListContext.Provider value={{ wishListCount, setWishListCount }}>
      {children}
    </wishListContext.Provider>
  );
};

export function useWishListCount() {
  return useContext(wishListContext);
}