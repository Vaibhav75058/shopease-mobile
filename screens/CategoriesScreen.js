import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

const BASE_URL = "https://e-commerce-mern-stack-0okr.onrender.com/api";

export default function CategoriesScreen({ navigation }) {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ─── FETCH CATEGORIES from /api/categories ─── */
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/categories`);
      const cats = response.data; // [{_id, name, image}, ...]

      setCategories(cats);

      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
        fetchProducts(cats[0]._id);
      }
    } catch (error) {
      console.log("fetchCategories error:", error);
    }
  };

  /* ─── FETCH PRODUCTS filtered by category ObjectId ─── */
  const fetchProducts = async (categoryId) => {
    try {
      const response = await axios.get(`${BASE_URL}/products`);

      const filtered = response.data.filter(
        (item) => item.category?._id === categoryId || item.category === categoryId
      );

      setProducts(filtered);
    } catch (error) {
      console.log("fetchProducts error:", error);
    }
  };

  /* ─── CATEGORY CLICK ─── */
  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    fetchProducts(cat._id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.heading}>Categories</Text>
        <Text style={styles.subHeading}>Discover premium products</Text>
      </View>

      {/* MAIN */}
      <View style={styles.main}>

        {/* SIDEBAR */}
        <View style={styles.sidebar}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {categories.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={[
                  styles.categoryItem,
                  selectedCategory?._id === item._id && styles.activeCategory,
                ]}
                onPress={() => handleCategory(item)}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.categoryImage}
                />
                <Text
                  style={[
                    styles.categoryText,
                    selectedCategory?._id === item._id && { color: "white" },
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* RIGHT CONTENT */}
        <View style={styles.content}>

          {/* BANNER */}
          <View style={styles.banner}>
            <View>
              <Text style={styles.bannerTitle}>
                {selectedCategory?.name || ""}
              </Text>
              <Text style={styles.bannerSub}>Trending Collection</Text>
            </View>
            <Image
              source={{ uri: selectedCategory?.image }}
              style={styles.bannerImage}
            />
          </View>

          {/* PRODUCTS */}
          <Text style={styles.sectionTitle}>Products</Text>

          <FlatList
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 220 }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No products in this category</Text>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.productCard}
                onPress={() => navigation.navigate("ProductDetails", { product: item })}
              >
                <Image source={{ uri: item.image }} style={styles.productImage} />
                <Text numberOfLines={2} style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>₹ {item.price}</Text>
              </TouchableOpacity>
            )}
          />

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: "#f4f6fb" },
  header:        { padding: 18 },
  heading:       { fontSize: 30, fontWeight: "bold", color: "#111" },
  subHeading:    { color: "gray", marginTop: 4 },
  main:          { flex: 1, flexDirection: "row" },
  sidebar:       { width: 90, backgroundColor: "#fff", paddingTop: 10 },
  categoryItem:  { alignItems: "center", marginBottom: 15, padding: 10, borderRadius: 16, marginHorizontal: 8, backgroundColor: "#f5f5f5" },
  activeCategory:{ backgroundColor: "#2874f0" },
  categoryImage: { width: 42, height: 42, borderRadius: 25, marginBottom: 8 },
  categoryText:  { fontSize: 12, textAlign: "center", color: "#111", fontWeight: "600" },
  content:       { flex: 1, padding: 15 },
  banner:        { backgroundColor: "#2874f0", borderRadius: 24, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  bannerTitle:   { fontSize: 24, fontWeight: "bold", color: "white" },
  bannerSub:     { color: "white", marginTop: 5 },
  bannerImage:   { width: 70, height: 70, borderRadius: 16, backgroundColor: "white" },
  sectionTitle:  { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  productCard:   { width: "48%", backgroundColor: "white", borderRadius: 20, padding: 10, marginBottom: 16, elevation: 3 },
  productImage:  { width: "100%", height: 140, borderRadius: 16 },
  productName:   { marginTop: 10, fontWeight: "bold", color: "#111" },
  productPrice:  { color: "#2874f0", fontWeight: "bold", fontSize: 18, marginTop: 6 },
  emptyText:     { textAlign: "center", color: "gray", marginTop: 40, fontSize: 16 },
});