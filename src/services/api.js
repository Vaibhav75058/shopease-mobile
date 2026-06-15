import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "https://e-commerce-mern-stack-0okr.onrender.com/api",
  timeout: 15000,
});

// Request interceptor to dynamically inject Authorization token
API.interceptors.request.use(
  async (config) => {
    try {
      const userData = await SecureStore.getItemAsync("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.log("Error reading token from SecureStore", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// We can export a function to set up response interceptors if we need to link it with auth state/navigation.
export const setupResponseInterceptors = (onLogout) => {
  API.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized request (401), logging out...");
        if (onLogout) {
          await onLogout();
        }
      }
      return Promise.reject(error);
    }
  );
};

export default API;
