import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";

import API from "../../src/services/api";

export default function ProductsScreen({ navigation }) {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await API.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log("fetchCategories error:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      Alert.alert("Deleted", "Product Deleted");
      fetchProducts();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <TextInput
        placeholder="🔍 Search products by name..."
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      {/* CATEGORY SELECTOR */}
      <View style={{ marginBottom: spacing.m }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: spacing.sm, paddingHorizontal: 2 }}
        >
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === "All" && styles.activeCategoryPill
            ]}
            onPress={() => setSelectedCategory("All")}
          >
            <Text style={[
              styles.categoryPillText,
              selectedCategory === "All" && styles.activeCategoryPillText
            ]}>All</Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.name && styles.activeCategoryPill
              ]}
              onPress={() => setSelectedCategory(cat.name)}
            >
              <Text style={[
                styles.categoryPillText,
                selectedCategory === cat.name && styles.activeCategoryPillText
              ]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={styles.heading}>
        All Products
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
      ) : (
      <FlatList
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProducts} colors={[colors.primary]} />}
        data={products.filter(p => {
          const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase());
          const matchesCategory = selectedCategory === "All" || p.category?.name === selectedCategory || p.category === selectedCategory;
          return matchesSearch && matchesCategory;
        })}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 90 }}
        ListEmptyComponent={!loading && <View style={{padding: 20, alignItems: 'center'}}><Text style={{...typography.body, color: colors.textLight}}>No products found.</Text></View>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>
                {item.name}
              </Text>
              <Text>₹ {item.price}</Text>
              <Text>Stock: {item.stock}</Text>
              <Text>{item.category?.name || "No Category"}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  navigation.navigate("Add Product", { editProduct: item });
                }}
              >
                <Text style={styles.buttonText}>
                  Edit
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => {
                  Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteProduct(item._id) }
                  ]);
                }}
              >
                <Text style={styles.buttonText}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 15,
  },
  heading: {
    fontSize: 30,
    ...typography.h3,
    marginBottom: 18,
    marginTop: 10,
    color: "#111",
  },
  buttonText: {
    color: "white",
    ...typography.h3,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 18,
    marginBottom: 14,
    elevation: 3,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 14,
    marginRight: 12,
  },
  name: {
    fontSize: 17,
    ...typography.h3,
    color: "#111",
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: "#ff9800",
    padding: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 10,
  },
  searchBar: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginVertical: 15,
    fontSize: 16,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  categoryPill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.borderLight || "#f1f1f1",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCategoryPill: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryPillText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  activeCategoryPillText: {
    color: colors.surface,
  },
});