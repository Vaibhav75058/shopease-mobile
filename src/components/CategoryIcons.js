import React from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import categories
  from "../data/categories";

export default function CategoryIcons() {

  return (

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    >

      {categories.map((item) => (

        <TouchableOpacity
          key={item.id}
          style={styles.card}
        >

          <View style={styles.imageBox}>

            <Image
              source={{
                uri: item.image,
              }}
              style={styles.image}
            />

          </View>

          <Text style={styles.name}>
            {item.name}
          </Text>

        </TouchableOpacity>

      ))}

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {

    marginBottom: 20,

  },

  card: {

    alignItems: "center",

    marginRight: 18,

  },

  imageBox: {

    width: 65,

    height: 65,

    borderRadius: 35,

    backgroundColor: "#fff",

    justifyContent: "center",

    alignItems: "center",

    elevation: 3,

  },

  image: {

    width: 34,

    height: 34,

    resizeMode: "contain",

  },

  name: {

    marginTop: 7,

    fontSize: 13,

    fontWeight: "500",

  },

});