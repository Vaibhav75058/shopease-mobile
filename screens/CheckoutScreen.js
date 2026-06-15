import React, { useEffect, useState, useCallback } from "react";
import API from "../src/services/api";
import {
  Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Image, Modal, RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AwesomeAlert from "react-native-awesome-alerts";
import { useCart } from "../src/context/CartContext";
import { useFocusEffect } from '@react-navigation/native';
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function CheckoutScreen({ navigation }) {
  const cart = useCart();
  const cartItems = cart?.cartItems || [];
  const clearCart = cart?.clearCart;
  
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const itemsTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryFee = itemsTotal > 999 ? 0 : 49;
  const platformFee = itemsTotal > 0 ? 9 : 0;
  const totalAmount = itemsTotal + deliveryFee + platformFee;

  const fetchAddresses = async () => {
    try {
      const res = await API.get("/address");
      setAddresses(res.data);
      if (res.data.length > 0) {
        if (!selectedAddress) {
          setSelectedAddress(res.data[0]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoadingAddresses(true);
      fetchAddresses();
    }, [])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAddresses();
    setRefreshing(false);
  }, []);

  const placeOrder = async () => {
    if (!selectedAddress) {
      navigation.navigate("AddAddress");
      return;
    }
    try {
      setLoading(true);
      const orderData = {
        orderItems: cartItems.map((item) => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id,
        })),
        shippingAddress: {
          address: `${selectedAddress.flat}, ${selectedAddress.area}`,
          city: selectedAddress.city,
          pincode: selectedAddress.pincode,
          phone: selectedAddress.phone,
        },
        paymentMethod,
        totalPrice: totalAmount,
      };
      await API.post("/orders", orderData);
      await clearCart();
      setSuccessModal(true);
      setTimeout(() => {
        setSuccessModal(false);
        navigation.replace("MyOrders");
      }, 2500);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Order Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* ADDRESS */}
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.heading}>Select Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate("AddAddress")}>
              <Text style={styles.addNew}>+ Add New</Text>
            </TouchableOpacity>
          </View>
          
          {loadingAddresses ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : addresses.length === 0 ? (
            <Text style={styles.emptyText}>No addresses found. Please add an address.</Text>
          ) : (
            addresses.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={[
                  styles.addressCard,
                  selectedAddress?._id === item._id && {
                    borderColor: colors.primary,
                    backgroundColor: colors.surface,
                  },
                ]}
                onPress={() => setSelectedAddress(item)}
              >
                <View style={styles.addressTop}>
                  <Text style={styles.addressName}>{item.fullName}</Text>
                  <Image
                    source={
                      selectedAddress?._id === item._id
                        ? require("../assets/icons/radio-selected.png")
                        : require("../assets/icons/radio-unselected.png")
                    }
                    style={{ width: 22, height: 22, resizeMode: "contain" }}
                  />
                </View>
                <Text style={styles.addressText}>
                  {item.flat}, {item.area}, {item.city}, {item.state} - {item.pincode}
                </Text>
                <Text style={styles.phone}>📞 {item.phone}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* PRODUCTS */}
        <View style={styles.card}>
          <Text style={styles.heading}>Order Items</Text>
          {cartItems.map((item) => (
            <View key={item._id} style={styles.productCard}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={{ flex: 1 }}>
                <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>₹ {item.price.toLocaleString("en-IN")}</Text>
                <Text style={styles.qty}>Qty: {item.qty}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* PAYMENT */}
        <View style={styles.card}>
          <Text style={styles.heading}>Payment Method</Text>
          {["UPI", "Card", "COD"].map((method) => (
            <TouchableOpacity
              key={method}
              style={styles.paymentItem}
              onPress={() => setPaymentMethod(method)}
            >
              <View style={styles.paymentLeft}>
                <Image
                  source={
                    paymentMethod === method
                      ? require("../assets/icons/radio-selected.png")
                      : require("../assets/icons/radio-unselected.png")
                  }
                  style={{ width: 22, height: 22, resizeMode: "contain" }}
                />
                <Text style={styles.paymentText}>{method}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* SUMMARY */}
        <View style={styles.card}>
          <Text style={styles.heading}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Items Total</Text>
            <Text style={styles.summaryPrice}>₹ {itemsTotal.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Delivery Fee</Text>
            <Text style={styles.summaryPrice}>₹ {deliveryFee.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Platform Fee</Text>
            <Text style={styles.summaryPrice}>₹ {platformFee.toLocaleString("en-IN")}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalText}>Total Amount</Text>
            <Text style={styles.totalPrice}>₹ {totalAmount.toLocaleString("en-IN")}</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.bottomLabel}>Total</Text>
          <Text style={styles.bottomPrice}>₹ {totalAmount.toLocaleString("en-IN")}</Text>
        </View>
        <TouchableOpacity style={styles.orderButton} onPress={placeOrder} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.orderText}>
              {selectedAddress ? "Place Order" : "Add Address"}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* SUCCESS */}
      <AwesomeAlert
        show={successModal}
        title="Order Placed 🎉"
        message="Your order has been placed successfully"
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showConfirmButton={false}
        titleStyle={{ fontFamily: fonts.bold || "Poppins_700Bold", color: "#1b9e4b", fontSize: 20 }}
        messageStyle={{ fontFamily: fonts.regular || "Poppins_400Regular", color: colors.textSecondary || "#555", textAlign: "center" }}
        contentContainerStyle={{ borderRadius: 18, padding: 20, backgroundColor: colors.surface || "white" }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background || "#f5f7fb",
  },
  card: {
    backgroundColor: colors.surface || "white",
    margin: spacing?.md || 15,
    borderRadius: radius?.lg || 22,
    padding: spacing?.md || 18,
    ...shadows?.medium,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing?.md || 15,
  },
  heading: {
    ...typography.h2,
    color: colors.text || "#111",
  },
  addNew: {
    color: colors.primary || "#2874f0",
    ...typography.subtitle,
  },
  addressCard: {
    borderWidth: 2,
    borderColor: colors.border || "#eee",
    borderRadius: radius?.md || 18,
    padding: spacing?.md || 15,
    marginBottom: spacing?.md || 15,
  },
  addressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressName: {
    ...typography.subtitle,
    color: colors.text || "#111",
  },
  addressText: {
    color: colors.textSecondary || "#555",
    marginTop: spacing?.xs || 8,
    lineHeight: 22,
  },
  phone: {
    marginTop: spacing?.sm || 10,
    color: colors.textSecondary || "#444",
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary || "#555",
    textAlign: 'center',
    marginVertical: spacing?.md || 15,
  },
  productCard: {
    flexDirection: "row",
    marginBottom: spacing?.md || 18,
  },
  productImage: {
    width: 90,
    height: 90,
    borderRadius: radius?.md || 16,
    marginRight: spacing?.sm || 14,
  },
  productName: {
    ...typography.subtitle,
    color: colors.text || "#111",
  },
  productPrice: {
    marginTop: spacing?.xs || 8,
    color: colors.primary || "#2874f0",
    ...typography.subtitle,
  },
  qty: {
    marginTop: spacing?.xs || 6,
    color: colors.textSecondary || "gray",
  },
  paymentItem: {
    paddingVertical: spacing?.sm || 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || "#eee",
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    marginLeft: spacing?.sm || 10,
    ...typography.subtitle,
    color: colors.text || "#111",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing?.md || 15,
  },
  summaryText: {
    color: colors.textSecondary || "#555",
    ...typography.body,
  },
  summaryPrice: {
    ...typography.subtitle,
    color: colors.text || "#111",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing?.sm || 10,
    borderTopWidth: 1,
    borderTopColor: colors.border || "#eee",
    paddingTop: spacing?.md || 15,
  },
  totalText: {
    ...typography.h2,
    color: colors.text || "#111",
  },
  totalPrice: {
    ...typography.h2,
    color: colors.primary || "#2874f0",
  },
  bottomBar: {
    backgroundColor: colors.surface || "white",
    padding: spacing?.md || 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopLeftRadius: radius?.lg || 24,
    borderTopRightRadius: radius?.lg || 24,
    ...shadows?.large,
    elevation: 15,
  },
  bottomLabel: {
    color: colors.textSecondary || "gray",
    ...typography.body,
  },
  bottomPrice: {
    ...typography.h1,
    color: colors.text || "#111",
  },
  orderButton: {
    backgroundColor: colors.primary || "#2874f0",
    paddingHorizontal: spacing?.xl || 35,
    paddingVertical: spacing?.md || 18,
    borderRadius: radius?.md || 18,
  },
  orderText: {
    color: colors.surface || "white",
    ...typography.subtitle,
  },
});