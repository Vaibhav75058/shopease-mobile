import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";

import DashboardScreen from "./DashboardScreen";

import ProductsScreen from "./ProductsScreen";

import OrdersScreen from "./OrdersScreen";

import UsersScreen from "./UsersScreen";

const Tab =
  createMaterialTopTabNavigator();

export default function AdminNavigator() {

  return (

    <SafeAreaView
      style={{ flex: 1 }}
    >

      <Tab.Navigator

        screenOptions={{

          tabBarActiveTintColor:
            "black",

          tabBarInactiveTintColor:
            "#e94560",

          tabBarIndicatorStyle: {

            backgroundColor:
              "#e94560",

          },

          tabBarStyle: {

            backgroundColor:
              "white",

          },

          tabBarLabelStyle: {

            fontWeight: "bold",

          },

        }}

      >

        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
        />

        <Tab.Screen
          name="Products"
          component={ProductsScreen}
        />

        <Tab.Screen
          name="Orders"
          component={OrdersScreen}
        />

        <Tab.Screen
          name="Users"
          component={UsersScreen}
        />

      </Tab.Navigator>

    </SafeAreaView>

  );

}