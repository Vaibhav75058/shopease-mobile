import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";

import * as Location
  from "expo-location";

import axios
  from "axios";

import Ionicons
  from "@expo/vector-icons/Ionicons";

import {
  useAuth,
} from "../src/context/AuthContext";

export default function AddAddressScreen({

  navigation,

  route,

}) {

  const {
    user,
  } = useAuth();

  /* EDIT DATA */

  const editData =
    route?.params?.editData;

  const isEdit =
    !!editData;

  const [
    form,
    setForm,
  ] = useState({

    fullName: "",

    phone: "",

    flat: "",

    area: "",

    city: "",

    state: "",

    pincode: "",

    type: "Home",

  });

  /* PREFILL */

  useEffect(() => {

    if (editData) {

      setForm({

        fullName:
          editData.fullName || "",

        phone:
          editData.phone || "",

        flat:
          editData.flat || "",

        area:
          editData.area || "",

        city:
          editData.city || "",

        state:
          editData.state || "",

        pincode:
          editData.pincode || "",

        type:
          editData.type || "Home",

        latitude:
          editData.latitude,

        longitude:
          editData.longitude,

      });

    }

  }, []);

  /* LOCATION */

  const getLocation =
    async () => {

      try {

        const {
          status,
        } =
          await Location.requestForegroundPermissionsAsync();

        if (
          status !==
          "granted"
        ) {

          Alert.alert(
            "Permission denied"
          );

          return;

        }

        const location =
          await Location.getCurrentPositionAsync(
            {}
          );

        const reverse =
          await Location.reverseGeocodeAsync({

            latitude:
              location.coords
                .latitude,

            longitude:
              location.coords
                .longitude,

          });

        const data =
          reverse[0];

        setForm({

          ...form,

          area:
            data.street || "",

          city:
            data.city || "",

          state:
            data.region || "",

          pincode:
            data.postalCode || "",

          latitude:
            location.coords
              .latitude,

          longitude:
            location.coords
              .longitude,

        });

      } catch (error) {

        console.log(error);

      }

    };

  /* SAVE / UPDATE */

  const saveAddress =
    async () => {

      try {

        if (isEdit) {

          /* UPDATE */

          await axios.put(

            `https://e-commerce-mern-stack-0okr.onrender.com/api/address/${editData._id}`,

            form,

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
            }
          );

          Alert.alert(
            "Success",
            "Address Updated"
          );

        } else {

          /* NEW SAVE */

          await axios.post(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/address",

            form,

            {
              headers: {

                Authorization:
                  `Bearer ${user.token}`,

              },
            }
          );

          Alert.alert(
            "Success",
            "Address Saved"
          );

        }

        navigation.goBack();

      } catch (error) {

        console.log(

          error.response?.data ||

          error.message
        );

      }

    };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={
        false
      }
    >

      {/* LOCATION */}

      <TouchableOpacity

        style={
          styles.locationBtn
        }

        onPress={
          getLocation
        }

      >

        <Image
          source={require("../assets/icons/map.png")}
          style={{
            width: 22,
            height: 22,
            // tintColor: "white",
            resizeMode: "contain",
          }}
        />

        <Text
          style={
            styles.locationText
          }
        >

          Use Current Location

        </Text>

      </TouchableOpacity>

      {/* INPUTS */}

      <TextInput

        placeholder="Full Name"

        style={styles.input}

        value={form.fullName}

        onChangeText={(text) =>
          setForm({
            ...form,
            fullName:
              text,
          })
        }

      />

      <TextInput

        placeholder="Phone"

        style={styles.input}

        value={form.phone}

        onChangeText={(text) =>
          setForm({
            ...form,
            phone: text,
          })
        }

      />

      <TextInput

        placeholder="Flat / House"

        style={styles.input}

        value={form.flat}

        onChangeText={(text) =>
          setForm({
            ...form,
            flat: text,
          })
        }

      />

      <TextInput

        placeholder="Area"

        style={styles.input}

        value={form.area}

        onChangeText={(text) =>
          setForm({
            ...form,
            area: text,
          })
        }

      />

      <TextInput

        placeholder="City"

        style={styles.input}

        value={form.city}

        onChangeText={(text) =>
          setForm({
            ...form,
            city: text,
          })
        }

      />

      <TextInput

        placeholder="State"

        style={styles.input}

        value={form.state}

        onChangeText={(text) =>
          setForm({
            ...form,
            state: text,
          })
        }

      />

      <TextInput

        placeholder="Pincode"

        style={styles.input}

        value={form.pincode}

        onChangeText={(text) =>
          setForm({
            ...form,
            pincode:
              text,
          })
        }

      />

      {/* SAVE BUTTON */}

      <TouchableOpacity

        style={
          styles.saveBtn
        }

        onPress={
          saveAddress
        }

      >

        <Text
          style={
            styles.saveText
          }
        >

          {

            isEdit

              ? "Update Address"

              : "Save Address"

          }

        </Text>

      </TouchableOpacity>

    </ScrollView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#fff",

      padding: 15,

    },

    locationBtn: {

      backgroundColor:
        "#2874f0",

      padding: 16,

      borderRadius: 15,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      marginBottom: 25,

    },

    locationText: {

      color: "white",

      fontWeight: "bold",

      marginLeft: 8,

      fontSize: 16,

    },

    input: {

      borderWidth: 1,

      borderColor:
        "#ddd",

      borderRadius: 14,

      padding: 15,

      marginBottom: 16,

      fontSize: 15,

      backgroundColor:
        "#fafafa",

    },

    saveBtn: {

      backgroundColor:
        "#2874f0",

      padding: 18,

      borderRadius: 15,

      marginTop: 10,

      marginBottom: 40,

    },

    saveText: {

      color: "white",

      textAlign:
        "center",

      fontWeight:
        "bold",

      fontSize: 17,

    },

  });