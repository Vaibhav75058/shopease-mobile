import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import axios from "axios";

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
            await axios.get(

              "https://e-commerce-mern-stack-0okr.onrender.com/api/wishlist",

              {
                headers: {

                  Authorization:
                    `Bearer ${user.token}`,

                },
              }
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

          await axios.post(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/wishlist",

            {
              productId:
                product._id,
            },

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
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

          await axios.delete(

            `https://e-commerce-mern-stack-0okr.onrender.com/api/wishlist/${id}`,

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
            }
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