import "react-native-gesture-handler";

import React from "react";

import {

  NotificationProvider,

} from "./src/context/NotificationContext";

import CategoriesScreen
  from "./screens/CategoriesScreen";

import WishlistScreen
  from "./screens/WishlistScreen";

import OrderDetailsScreen
  from "./screens/OrderDetailsScreen";
import HelpCenterScreen
  from "./screens/HelpCenterScreen";

import SavedAddressesScreen from "./screens/SavedAddressesScreen";

import AddAddressScreen from "./screens/AddAddressScreen";

import NotificationsScreen
  from "./screens/NotificationsScreen";

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

import Ionicons
  from "@expo/vector-icons/Ionicons";

import HomeScreen
  from "./screens/HomeScreen";

import ProductDetailsScreen
  from "./screens/ProductDetailsScreen";

import CategoryProductsScreen
  from "./screens/CategoryProductsScreen";

import LoginScreen
  from "./screens/LoginScreen";

import RegisterScreen
  from "./screens/RegisterScreen";

import CartScreen
  from "./screens/CartScreen";

import ProfileScreen
  from "./screens/ProfileScreen";

import CheckoutScreen
  from "./screens/CheckoutScreen";

import ChatBotScreen
  from "./screens/ChatBotScreen";

import AdminNavigator
  from "./screens/admin/AdminNavigator";
import AdminDashboardScreen
  from "./screens/AdminDashboardScreen";
import MyOrdersScreen
  from "./screens/MyOrdersScreen";
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

          tabBarStyle: {

            height: 70,

            paddingBottom: 8,

            paddingTop: 8,

            borderTopLeftRadius: 18,

            borderTopRightRadius: 18,

            backgroundColor: "white",

            position: "absolute",

            elevation: 10,

          },

          tabBarLabelStyle: {

            fontSize: 12,

            fontWeight: "600",

          },

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
              route.name === "Categories"
            ) {

              iconName = "grid";

            } else if (
              route.name === "Cart"
            ) {

              iconName = "cart";

            } else if (
              route.name === "Account"
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
                size={24}
                color={color}
              />

            );

          },

          tabBarActiveTintColor:
            "#2874f0",

          tabBarInactiveTintColor:
            "gray",

        })}

      >

        <Tab.Screen
          name="Home"
          component={HomeScreen}
          listeners={{
            tabPress: () => { },
          }}
        />

        <Tab.Screen
          name="Categories"
          component={CategoriesScreen}
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
          name="Account"
          component={ProfileScreen}
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



      {
        navigation
          ?.getState()
          ?.routes?.[
          navigation.getState().index
        ]?.state?.index === 0 && (

          <TouchableOpacity

            style={{

              position: "absolute",

              bottom: 90,

              right: 20,

              backgroundColor: "#2874f0",

              width: 65,

              height: 65,

              borderRadius: 40,

              justifyContent: "center",

              alignItems: "center",

              elevation: 10,

            }}

            onPress={() =>
              navigation.navigate("ChatBot")
            }

          >

            <Ionicons
              name="chatbubble"
              size={30}
              color="white"
            />

          </TouchableOpacity>

        )
      }
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

            name="Home"

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
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen

            name="OrderDetails"

            component={
              OrderDetailsScreen
            }

          />
          <Stack.Screen

            name="CategoryProducts"

            component={
              CategoryProductsScreen
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

          <Stack.Screen

            name="SavedAddresses"

            component={
              SavedAddressesScreen
            }

          />
          <Stack.Screen
            name="HelpCenter"
            component={HelpCenterScreen}
          />
          <Stack.Screen

            name="AddAddress"

            component={
              AddAddressScreen
            }

          />
          <Stack.Screen

            name="Notifications"

            component={
              NotificationsScreen
            }

          />
          <Stack.Screen

            name="MyOrders"

            component={
              MyOrdersScreen
            }

          />
          <Stack.Screen

            name="AdminDashboard"

            component={
              AdminDashboardScreen
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
    <NotificationProvider>
      <AuthProvider>

        <WishlistProvider>

          <CartProvider>

            <NavigationContainer>

              <>

                <MainNavigator />



              </>

            </NavigationContainer>

          </CartProvider>

        </WishlistProvider>

      </AuthProvider>
    </NotificationProvider>
  );

}