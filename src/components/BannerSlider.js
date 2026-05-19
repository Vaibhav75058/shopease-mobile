import React from "react";

import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";

import {
  SwiperFlatList,
} from "react-native-swiper-flatlist";

import banners
  from "../data/banners";

const { width } =
  Dimensions.get("window");

export default function BannerSlider() {

  return (

    <View style={styles.wrapper}>

      <SwiperFlatList

        autoplay

        autoplayDelay={3}

        autoplayLoop

        showPagination

        paginationStyleItem={{

          width: 8,
          height: 8,
          borderRadius: 4,

        }}

      >

        {banners.map((item) => (

          <ImageBackground

            key={item.id}

            source={{
              uri: item.image,
            }}

            style={styles.banner}

            imageStyle={{
              borderRadius: 24,
            }}

          >

            <View style={styles.overlay}>

              <Text style={styles.title}>
                {item.title}
              </Text>

              <Text style={styles.subtitle}>
                {item.subtitle}
              </Text>

            </View>

          </ImageBackground>

        ))}

      </SwiperFlatList>

    </View>

  );

}

const styles = StyleSheet.create({

  wrapper: {

    height: 220,

    marginBottom: 25,

  },

  banner: {

    width: width - 30,

    height: 220,

    justifyContent: "flex-end",

    padding: 20,

  },

  overlay: {

    backgroundColor:
      "rgba(0,0,0,0.35)",

    padding: 14,

    borderRadius: 16,

    width: "70%",

  },

  title: {

    color: "white",

    fontSize: 24,

    fontWeight: "bold",

  },

  subtitle: {

    color: "white",

    marginTop: 5,

    fontSize: 14,

  },

});