import React, {
  createContext,
  useContext,
  useState,
} from "react";

const NotificationContext =
  createContext();

export const NotificationProvider = ({
  children,
}) => {

  const [
    notifications,
    setNotifications,
  ] = useState([]);

  const addNotification = (
    text
  ) => {

    const newNotification = {

      id: Date.now(),

      text,

      createdAt:
        new Date(),

    };

    setNotifications(
      (prev) => [

        newNotification,

        ...prev,

      ]
    );

  };

  return (

    <NotificationContext.Provider

      value={{

        notifications,

        addNotification,

      }}

    >

      {children}

    </NotificationContext.Provider>

  );

};

export const useNotification =
  () =>
    useContext(
      NotificationContext
    );