import "react-native-gesture-handler";

import React, {
  useEffect,
  useState,
} from "react";

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
  ActivityIndicator,
  Image,
  Text,
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

import * as Font from "expo-font";

import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

import { colors } from "./src/theme";

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

import ForgotPasswordScreen
  from "./screens/ForgotPasswordScreen";

import CartScreen
  from "./screens/CartScreen";

import ProfileScreen
  from "./screens/ProfileScreen";

import EditProfileScreen
  from "./screens/EditProfileScreen";

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

const loadFonts = async () => {
  try {
    await Font.loadAsync({
      Poppins_300Light,
      Poppins_400Regular,
      Poppins_500Medium,
      Poppins_600SemiBold,
      Poppins_700Bold,
      Poppins_800ExtraBold,
    });

    // Set Poppins as default font for ALL Text components globally
    const oldTextRender = Text.render;
    Text.render = function (...args) {
      const origin = oldTextRender.call(this, ...args);
      return React.cloneElement(origin, {
        style: [{ fontFamily: "Poppins_400Regular" }, origin.props.style],
      });
    };

    return true;
  } catch (error) {
    console.log('Font load error:', error);
    return true;
  }
};
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

            fontFamily: "Poppins_600SemiBold",

          },

          tabBarIcon: ({
            color,
            size,
          }) => {

            let iconName;

            if (
              route.name === "Home"
            ) {

              iconName = "home-outline";

            } else if (
              route.name === "Categories"
            ) {

              iconName = "grid-outline";

            } else if (
              route.name === "Cart"
            ) {

              iconName = "cart-outline";

            } else if (
              route.name === "Account"
            ) {

              iconName = "person-outline";

            } else if (
              route.name === "Admin"
            ) {

              iconName = "settings-outline";

            }

            return (
  <Image
    source={
      route.name === "Home"
        ? require("./assets/icons/home.png")
        : route.name === "Categories"
        ? require("./assets/icons/categories.png")
        : route.name === "Cart"
        ? require("./assets/icons/cart.png")
        : route.name === "Account"
        ? require("./assets/icons/user-profile.png")
        : route.name === "Admin"
        ? require("./assets/icons/admin.png")
        : require("./assets/icons/home.png")
    }
    style={{
      width: 24,
      height: 24,
      tintColor: color,
      resizeMode: "contain",
    }}
  />
);

          },

          tabBarActiveTintColor:
            colors.primary,

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

            name="MainTabs"

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
            options={{
              headerShown:
                false,
            }}
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
          <Stack.Screen
            name="EditProfile"
            component={
              EditProfileScreen
            }
            options={{
              headerShown: false,
            }}
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

          <Stack.Screen

            name="ForgotPassword"

            component={
              ForgotPasswordScreen
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

  const [

    fontsLoaded,

    setFontsLoaded,

  ] = useState(false);

  useEffect(() => {

  const prepare = async () => {

    await loadFonts();

    setFontsLoaded(true);

  };

  prepare();

}, []);

  

    if (!fontsLoaded) {
  
      return (
  
        <View
  
          style={{
  
            flex: 1,
  
            justifyContent:
              "center",
  
            alignItems:
              "center",
  
          }}
  
        >
  
          <ActivityIndicator
  
            size="large"
  
            color="#2874f0"
  
          />
  
        </View>
  
      );
  
    }
  
    return (
  
      <AuthProvider>
  
        <CartProvider>
  
          <WishlistProvider>
  
            <NotificationProvider>
  
              <NavigationContainer>
  
                <MainNavigator />
  
              </NavigationContainer>
  
            </NotificationProvider>
  
          </WishlistProvider>
  
        </CartProvider>
  
      </AuthProvider>
  
    );
  
  }