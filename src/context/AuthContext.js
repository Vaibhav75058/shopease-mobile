import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from "react";

import * as SecureStore from "expo-secure-store";
import { setupResponseInterceptors } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    // Configure response interceptor to auto-logout on 401 Unauthorized
    setupResponseInterceptors(logout);
  }, []);

  const loadUser = async () => {
    try {
      const userData = await SecureStore.getItemAsync("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.log("Error loading user credentials:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    try {
      await SecureStore.setItemAsync(
        "user",
        JSON.stringify(userData)
      );
      setUser(userData);
    } catch (error) {
      console.log("Error saving user credentials:", error);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync("user");
      setUser(null);
    } catch (error) {
      console.log("Error clearing user credentials:", error);
    }
  };

  const updateProfile = async (updatedFields) => {
    try {
      const updatedUser = { ...user, ...updatedFields };
      await SecureStore.setItemAsync("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    } catch (error) {
      console.log("Error updating profile in SecureStore:", error);
      return false;
    }
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        loading,
      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

export const useAuth = () =>
  useContext(AuthContext);