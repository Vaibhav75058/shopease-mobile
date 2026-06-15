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
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

import * as Location
  from "expo-location";

import API
  from "../src/services/api";

export default function AddAddressScreen({

  navigation,

  route,

}) {



  /* EDIT DATA */

  const editData =
    route?.params?.editData;

  const isEdit =
    !!editData;

  const [saving, setSaving] = useState(false);

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
        if (!form.fullName || !form.phone || !form.flat || !form.area || !form.city || !form.state || !form.pincode) {
          Alert.alert("Validation Error", "Please fill all required fields");
          return;
        }

        setSaving(true);

        if (isEdit) {

          /* UPDATE */

          await API.put(

            `/address/${editData._id}`,

            form

          );

          Alert.alert(
            "Success",
            "Address Updated"
          );

        } else {

          /* NEW SAVE */

          await API.post(

            "/address",

            form

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
        Alert.alert("Error", "Failed to save address");

      } finally {
        setSaving(false);
      }

    };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
        {saving && <ActivityIndicator color={colors.surface} style={{ marginLeft: spacing.sm }} />}
      </TouchableOpacity>

    </ScrollView>
    </KeyboardAvoidingView>
    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        colors.background,

      padding: spacing.md,

    },

    locationBtn: {

      backgroundColor:
        colors.primary,

      padding: spacing.md,

      borderRadius: radius.md,

      flexDirection: "row",

      justifyContent:
        "center",

      alignItems: "center",

      marginBottom: spacing.xl,

    },

    locationText: {

      color: colors.surface,

      ...typography.button,

      marginLeft: spacing.sm,

    },

    input: {

      borderWidth: 1,

      borderColor:
        colors.border,

      borderRadius: radius.md,

      padding: spacing.md,

      marginBottom: spacing.md,

      ...typography.body,

      backgroundColor:
        colors.surface,

    },

    saveBtn: {

      backgroundColor:
        colors.primary,

      padding: spacing.md,

      borderRadius: radius.md,

      marginTop: spacing.sm,

      marginBottom: spacing.xxl,

      flexDirection: "row",

      justifyContent: "center",

      alignItems: "center",

    },

    saveText: {

      color: colors.surface,

      textAlign:
        "center",

      ...typography.button,

    },

  });