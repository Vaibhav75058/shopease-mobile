import React, {
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import categories
  from "../src/data/categories";

export default function CategoriesScreen() {

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState(
    categories[0]
  );

  return (

    <SafeAreaView
      edges={["top"]}
      style={styles.container}
    >

      {/* LEFT SIDEBAR */}

      <View style={styles.sidebar}>

        <FlatList

          data={categories}

          keyExtractor={(item) =>
            item.id.toString()
          }

          showsVerticalScrollIndicator={
            false
          }

          renderItem={({ item }) => (

            <TouchableOpacity

              style={[

                styles.sidebarItem,

                selectedCategory.id ===
                item.id &&

                styles.activeSidebar,

              ]}

              onPress={() =>
                setSelectedCategory(
                  item
                )
              }

            >

              <Image

                source={{
                  uri: item.image,
                }}

                style={styles.sidebarImage}

              />

              <Text
                style={styles.sidebarText}
              >

                {item.name}

              </Text>

            </TouchableOpacity>

          )}

        />

      </View>

      {/* RIGHT CONTENT */}

      <View style={styles.content}>

        <Text style={styles.heading}>
          {selectedCategory.name}
        </Text>

        <Image

          source={{
            uri:
              selectedCategory.image,
          }}

          style={styles.banner}

        />

        <View style={styles.grid}>

          {[1, 2, 3, 4].map(
            (_, index) => (

              <TouchableOpacity

                key={index}

                style={styles.card}

              >

                <Image

                  source={{
                    uri:
                      selectedCategory.image,
                  }}

                  style={styles.cardImage}

                />

                <Text
                  style={styles.cardText}
                >

                  {
                    selectedCategory.name
                  }

                </Text>

              </TouchableOpacity>

            )
          )}

        </View>

      </View>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    flexDirection: "row",

    backgroundColor: "#f5f7fb",

  },

  sidebar: {

    width: 100,

    backgroundColor: "white",

    paddingTop: 10,

  },

  sidebarItem: {

    alignItems: "center",

    paddingVertical: 16,

    borderLeftWidth: 4,

    borderLeftColor:
      "transparent",

  },

  activeSidebar: {

    backgroundColor: "#eef4ff",

    borderLeftColor:
      "#2874f0",

  },

  sidebarImage: {

    width: 40,

    height: 40,

    resizeMode: "contain",

  },

  sidebarText: {

    fontSize: 12,

    marginTop: 6,

    textAlign: "center",

    fontWeight: "600",

  },

  content: {

    flex: 1,

    padding: 15,

  },

  heading: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 15,

  },

  banner: {

    width: "100%",

    height: 150,

    borderRadius: 18,

    resizeMode: "cover",

    marginBottom: 20,

  },

  grid: {

    flexDirection: "row",

    flexWrap: "wrap",

    justifyContent:
      "space-between",

  },

  card: {

    width: "47%",

    backgroundColor: "white",

    borderRadius: 18,

    padding: 12,

    marginBottom: 16,

    alignItems: "center",

    elevation: 2,

  },

  cardImage: {

    width: 60,

    height: 60,

    resizeMode: "contain",

  },

  cardText: {

    marginTop: 10,

    fontWeight: "600",

  },

});