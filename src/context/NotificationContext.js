import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef
} from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useAuth } from "./AuthContext";
import API from "../services/api";

// Configure local notification handlers
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const { user } = useAuth();

  const notificationListener = useRef();
  const responseListener = useRef();

  // Clear in-memory notification list when user session changes
  useEffect(() => {
    setNotifications([]);
  }, [user]);

  // Helper to add local inbox notifications
  const addNotification = (text) => {
    const newNotification = {
      id: Date.now(),
      text,
      createdAt: new Date(),
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // Register push tokens and setup listeners
  useEffect(() => {
    if (user) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          setExpoPushToken(token);
          // Send push token to backend server
          API.post("/users/push-token", { token })
            .then(() => console.log("Push token successfully saved to server"))
            .catch((err) => console.log("Failed to save push token on server:", err.message));
        }
      });
    }

    // Listener for when a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const bodyText = notification.request.content.body || "You have a new message";
      addNotification(bodyText);
    });

    // Listener for when a user taps on or interacts with a notification (works in background/foreground)
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data;
      console.log("Interactive push clicked. Data payload:", data);
      // You can add deep-linking or custom navigation logic here if needed
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        expoPushToken,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);

// Expo Push Notification setup helper
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      console.log("Failed to get push token for push notifications!");
      return;
    }
    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log("Acquired Expo Push Token:", token);
    } catch (error) {
      console.log("Error getting Expo Push Token:", error.message);
    }
  } else {
    console.log("Must use a physical device for Push Notifications");
  }

  return token;
}