import React from "react";

import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import Ionicons
  from "@expo/vector-icons/Ionicons";

export default function SearchBar({

  search,
  setSearch,

}) {

  return (

    <View style={styles.container}>

      <Ionicons
        name="search"
        size={24}
        color="#666"
      />

      <TextInput

        placeholder="Search products..."

        style={styles.input}

        value={search}

        onChangeText={setSearch}

        placeholderTextColor="#999"

      />

      {search.length > 0 && (

        <TouchableOpacity
          onPress={() =>
            setSearch("")
          }
        >

          <Ionicons
            name="close-circle"
            size={22}
            color="#777"
          />

        </TouchableOpacity>

      )}

    </View>

  );

}

const styles = StyleSheet.create({

  container: {

    backgroundColor: "white",

    borderRadius: 18,

    flexDirection: "row",

    alignItems: "center",

    paddingHorizontal: 15,

    height: 58,

    elevation: 4,

    marginBottom: 20,

  },

  input: {

    flex: 1,

    marginLeft: 10,

    fontSize: 16,

    color: "#111",

  },

});