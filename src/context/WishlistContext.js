import React, {
  createContext,
  useContext,
  useState,
} from "react";

const WishlistContext =
  createContext();

export const WishlistProvider = ({
  children,
}) => {

  const [
    wishlistItems,
    setWishlistItems,
  ] = useState([]);

  const addToWishlist = (
    product
  ) => {

    const exists =
      wishlistItems.find(

        (item) =>
          item._id === product._id

      );

    if (!exists) {

      setWishlistItems([
        ...wishlistItems,
        product,
      ]);

    }

  };

  const removeFromWishlist = (
    id
  ) => {

    setWishlistItems(

      wishlistItems.filter(

        (item) =>
          item._id !== id

      )

    );

  };

  return (

    <WishlistContext.Provider

      value={{

        wishlistItems,

        addToWishlist,

        removeFromWishlist,

      }}

    >

      {children}

    </WishlistContext.Provider>

  );

};

export const useWishlist =
  () => useContext(
    WishlistContext
  );