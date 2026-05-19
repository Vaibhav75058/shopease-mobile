import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {

    loadCart();

  }, []);

  const loadCart = async () => {

    try {

      const data =
        await AsyncStorage.getItem("cartItems");

      if (data) {

        setCartItems(JSON.parse(data));

      }

    } catch (error) {

      console.log(error);

    }

  };

  const addToCart = async (product) => {

    const existItem = cartItems.find(
      (x) => x._id === product._id
    );

    let updatedCart;

    if (existItem) {

      updatedCart = cartItems.map((x) =>

        x._id === product._id
          ? { ...x, qty: x.qty + 1 }
          : x

      );

    } else {

      updatedCart = [
        ...cartItems,
        { ...product, qty: 1 },
      ];

    }

    setCartItems(updatedCart);

    await AsyncStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

  };

  const removeFromCart = async (id) => {

    const updatedCart =
      cartItems.filter((x) => x._id !== id);

    setCartItems(updatedCart);

    await AsyncStorage.setItem(
      "cartItems",
      JSON.stringify(updatedCart)
    );

  };

  const clearCart = async () => {

    setCartItems([]);

    await AsyncStorage.removeItem(
      "cartItems"
    );

  };

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) =>
      acc + item.price * item.qty,
    0
  );

  return (

    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >

      {children}

    </CartContext.Provider>

  );

};

export const useCart = () =>
  useContext(CartContext);