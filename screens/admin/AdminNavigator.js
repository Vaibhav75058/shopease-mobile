import React from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  createMaterialTopTabNavigator,
} from "@react-navigation/material-top-tabs";

import DashboardScreen from "./DashboardScreen";
import ProductsScreen from "./ProductsScreen";
import AddProductScreen from "./AddProductScreen";
import OrdersScreen from "./OrdersScreen";
import UsersScreen from "./UsersScreen";
import CategoriesScreen from "./CategoriesScreen";

const Tab = createMaterialTopTabNavigator();

export default function AdminNavigator() {

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#2874f0",
          tabBarInactiveTintColor: "#8e8e93",
          tabBarIndicatorStyle: {
            backgroundColor: "#2874f0",
          },
          tabBarStyle: {
            backgroundColor: "white",
          },
          tabBarLabelStyle: {
            fontFamily: "Poppins_700Bold",
            fontSize: 13,
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: "auto",
            paddingHorizontal: 12,
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
          name="Add Product"
          component={AddProductScreen}
        />
        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
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