import React, { useEffect, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, ScrollView, ActivityIndicator, RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import API from "../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../src/theme";

export default function CategoriesScreen({ navigation }) {

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await fetchCategories();
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCategories();
    setRefreshing(false);
  };

  /* ─── FETCH CATEGORIES from /api/categories ─── */
  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      const cats = response.data; // [{_id, name, image}, ...]

      setCategories(cats);

      if (cats.length > 0) {
        setSelectedCategory(cats[0]);
        await fetchProducts(cats[0]._id);
      }
    } catch (error) {
      console.log("fetchCategories error:", error);
    }
  };

  /* ─── FETCH PRODUCTS filtered by category ObjectId ─── */
  const fetchProducts = async (categoryId) => {
    try {
      const response = await API.get("/products");

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
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
            }
          >
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
                    selectedCategory?._id === item._id && { color: colors.textWhite },
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
          {loading ? (
            <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
          ) : (
            <>
              {/* BANNER */}
              {selectedCategory && (
                <View style={styles.banner}>
                  <View>
                    <Text style={styles.bannerTitle}>
                      {selectedCategory.name}
                    </Text>
                    <Text style={styles.bannerSub}>Trending Collection</Text>
                  </View>
                  <Image
                    source={{ uri: selectedCategory.image }}
                    style={styles.bannerImage}
                  />
                </View>
              )}

              {/* PRODUCTS */}
              <Text style={styles.sectionTitle}>Products</Text>

              <FlatList
                data={products}
                keyExtractor={(item) => item._id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: spacing.xxl * 3 }}
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
                    <Text style={styles.productPrice}>₹ {item.price?.toLocaleString("en-IN")}</Text>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: colors.background },
  header:        { padding: spacing.lg },
  heading:       { ...typography.h1 },
  subHeading:    { ...typography.bodyMedium, color: colors.textMuted },
  main:          { flex: 1, flexDirection: "row" },
  sidebar:       { width: 90, backgroundColor: colors.surface, paddingTop: spacing.md },
  categoryItem:  { alignItems: "center", marginBottom: spacing.md, padding: spacing.sm, borderRadius: radius.lg, marginHorizontal: spacing.sm, backgroundColor: colors.inputBg },
  activeCategory:{ backgroundColor: colors.primary },
  categoryImage: { width: 42, height: 42, borderRadius: 21, marginBottom: spacing.xs },
  categoryText:  { ...typography.labelSmall, textAlign: "center", color: colors.textPrimary },
  content:       { flex: 1, padding: spacing.md },
  loader:        { flex: 1, justifyContent: "center", alignItems: "center" },
  banner:        { backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing.lg, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.lg },
  bannerTitle:   { ...typography.h2, color: colors.textWhite },
  bannerSub:     { ...typography.bodySmall, color: colors.textWhite, marginTop: spacing.xs },
  bannerImage:   { width: 70, height: 70, borderRadius: radius.lg, backgroundColor: colors.surface },
  sectionTitle:  { ...typography.h3, marginBottom: spacing.md },
  productCard:   { width: "48%", backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.sm, marginBottom: spacing.md, ...shadows.sm },
  productImage:  { width: "100%", height: 140, borderRadius: radius.md },
  productName:   { marginTop: spacing.sm, ...typography.bodyMedium, color: colors.textPrimary, height: 38 },
  productPrice:  { ...typography.priceSmall, color: colors.primary, marginTop: spacing.xs },
  emptyText:     { ...typography.body, textAlign: "center", color: colors.textMuted, marginTop: spacing.xl },
});