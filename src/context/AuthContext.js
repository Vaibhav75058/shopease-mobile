import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    loadUser();

  }, []);

  const loadUser = async () => {

    try {

      const userData =
        await AsyncStorage.getItem("user");

      if (userData) {

        setUser(JSON.parse(userData));

      }

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }

  };

  const login = async (userData) => {

    try {

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData)
      );

      setUser(userData);

    } catch (error) {

      console.log(error);

    }

  };

  const logout = async () => {

    try {

      await AsyncStorage.removeItem("user");

      setUser(null);

    } catch (error) {

      console.log(error);

    }

  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);