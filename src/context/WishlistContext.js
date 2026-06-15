import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import API from "../services/api";

import {
  useAuth,
} from "./AuthContext";

const WishlistContext =
  createContext();

export const WishlistProvider =
  ({ children }) => {

    const {
      user,
    } = useAuth();

    const [
      wishlist,
      setWishlist,
    ] = useState([]);

    /* FETCH */

    useEffect(() => {

      if (user) {

        fetchWishlist();

      }

    }, [user]);

    const fetchWishlist =
      async () => {

        try {

          const res =
            await API.get(

              "/wishlist"

            );

          setWishlist(
            res.data
          );

        } catch (error) {

          console.log(error);

        }

      };

    /* ADD */

    const addToWishlist =
      async (product) => {

        try {

          await API.post(

            "/wishlist",

            {
              productId:
                product._id,
            }

          );

          fetchWishlist();

        } catch (error) {

          console.log(error);

        }

      };

    /* REMOVE */

    const removeFromWishlist =
      async (id) => {

        try {

          await API.delete(

            `/wishlist/${id}`

          );

          fetchWishlist();

        } catch (error) {

          console.log(error);

        }

      };

    return (

      <WishlistContext.Provider

        value={{

          wishlist,

          addToWishlist,

          removeFromWishlist,

        }}

      >

        {children}

      </WishlistContext.Provider>

    );

  };

export const useWishlist =
  () =>
    useContext(
      WishlistContext
    );