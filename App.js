import "react-native-gesture-handler";

import React from "react";

import WishlistScreen
  from "./screens/WishlistScreen";

import {
  View,
  TouchableOpacity,
} from "react-native";

import {
  WishlistProvider,
} from "./src/context/WishlistContext";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import {
  Ionicons
} from "@expo/vector-icons";
import Ionicons
  from "@expo/vector-icons/Ionicons";

import HomeScreen
  from "./screens/HomeScreen";

import ProductDetailsScreen
  from "./screens/ProductDetailsScreen";

import LoginScreen
  from "./screens/LoginScreen";

import RegisterScreen
  from "./screens/RegisterScreen";

import CartScreen
  from "./screens/CartScreen";

import ProfileScreen
  from "./screens/ProfileScreen";

import MyOrdersScreen
  from "./screens/MyOrdersScreen";

import CheckoutScreen
  from "./screens/CheckoutScreen";

import ChatBotScreen
  from "./screens/ChatBotScreen";

import AdminNavigator
  from "./screens/admin/AdminNavigator";

import {
  AuthProvider,
  useAuth,
} from "./src/context/AuthContext";

import {
  CartProvider,
  useCart,
} from "./src/context/CartContext";

const Stack =
  createNativeStackNavigator();

const Tab =
  createBottomTabNavigator();

function BottomTabs({
  navigation,
}) {

  const cart = useCart();

  const totalItems =
    cart?.totalItems || 0;

  const auth = useAuth();

  const user =
    auth?.user || null;

  return (

    <View style={{ flex: 1 }}>

      <Tab.Navigator

        screenOptions={({
          route,
        }) => ({

          headerShown: false,

          tabBarIcon: ({
            color,
            size,
          }) => {

            let iconName;

            if (
              route.name === "Home"
            ) {

              iconName = "home";

            } else if (
              route.name === "Cart"
            ) {

              iconName = "cart";

            } else if (
              route.name === "Orders"
            ) {

              iconName = "bag";

            } else if (
              route.name === "Profile"
            ) {

              iconName = "person";

            } else if (
              route.name === "Admin"
            ) {

              iconName =
                "settings";

            }

            return (

              <Ionicons
                name={iconName}
                size={size}
                color={color}
              />

            );

          },

          tabBarActiveTintColor:
            "#e94560",

          tabBarInactiveTintColor:
            "gray",

        })}

      >

        <Tab.Screen
          name="Home"
          component={HomeScreen}
        />

        <Tab.Screen

          name="Cart"

          component={CartScreen}

          options={{

            tabBarBadge:
              totalItems > 0
                ? totalItems
                : null,

          }}

        />

        <Tab.Screen
          name="Orders"
          component={
            MyOrdersScreen
          }
        />

        <Tab.Screen
          name="Profile"
          component={
            ProfileScreen
          }
        />

        {user?.isAdmin && (

          <Tab.Screen
            name="Admin"
            component={
              AdminNavigator
            }
          />

        )}

      </Tab.Navigator>

      <TouchableOpacity

        style={{

          position:
            "absolute",

          bottom: 90,

          right: 20,

          backgroundColor:
            "#e94560",

          width: 65,

          height: 65,

          borderRadius: 40,

          justifyContent:
            "center",

          alignItems:
            "center",

          elevation: 10,

        }}

        onPress={() =>
          navigation.navigate(
            "ChatBot"
          )
        }

      >

        <Ionicons
          name="chatbubble"
          size={30}
          color="white"
        />

      </TouchableOpacity>

    </View>

  );

}

function MainNavigator() {

  const auth = useAuth();

  const user =
    auth?.user || null;

  const loading =
    auth?.loading || false;

  if (loading) {

    return (

      <View
        style={{
          flex: 1,
          justifyContent:
            "center",
          alignItems:
            "center",
        }}
      />

    );

  }

  return (

    <Stack.Navigator>

      {user ? (

        <>

          <Stack.Screen

            name="Main"

            component={
              BottomTabs
            }

            options={{
              headerShown:
                false,
            }}

          />

          <Stack.Screen
            name="ProductDetails"
            component={
              ProductDetailsScreen
            }
          />

          <Stack.Screen
            name="ChatBot"
            component={
              ChatBotScreen
            }
          />

          <Stack.Screen
            name="Checkout"
            component={
              CheckoutScreen
            }
          />

          <Stack.Screen
            name="Wishlist"
            component={
              WishlistScreen
            }
          />

        </>

      ) : (

        <>

          <Stack.Screen

            name="Login"

            component={
              LoginScreen
            }

            options={{
              headerShown:
                false,
            }}

          />

          <Stack.Screen

            name="Register"

            component={
              RegisterScreen
            }

            options={{
              headerShown:
                false,
            }}

          />

        </>

      )}

    </Stack.Navigator>

  );

}

export default function App() {

  return (

    <AuthProvider>

      <WishlistProvider>

        <CartProvider>

          <NavigationContainer>

            <MainNavigator />

          </NavigationContainer>

        </CartProvider>

      </WishlistProvider>

    </AuthProvider>

  );

}