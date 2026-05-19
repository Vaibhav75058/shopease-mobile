import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const WishlistContext =
  createContext();

export const WishlistProvider = ({
  children,
}) => {

  const [wishlistItems,
    setWishlistItems] =
    useState([]);

  useEffect(() => {

    loadWishlist();

  }, []);

  const loadWishlist = async () => {

    try {

      const data =
        await AsyncStorage.getItem(
          "wishlistItems"
        );

      if (data) {

        setWishlistItems(
          JSON.parse(data)
        );

      }

    } catch (error) {

      console.log(error);

    }

  };

  const addToWishlist = async (
    product
  ) => {

    const exists =
      wishlistItems.find(
        (x) => x._id === product._id
      );

    let updatedWishlist;

    if (exists) {

      updatedWishlist =
        wishlistItems.filter(
          (x) => x._id !== product._id
        );

    } else {

      updatedWishlist = [
        ...wishlistItems,
        product,
      ];

    }

    setWishlistItems(updatedWishlist);

    await AsyncStorage.setItem(

      "wishlistItems",

      JSON.stringify(updatedWishlist)

    );

  };

  return (

    <WishlistContext.Provider

      value={{

        wishlistItems,

        addToWishlist,

      }}

    >

      {children}

    </WishlistContext.Provider>

  );

};

export const useWishlist = () =>
  useContext(WishlistContext);