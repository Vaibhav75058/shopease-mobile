import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import API from "../../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCategories(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "We need access to your photos to upload images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const addCategory = async () => {
    if (!name.trim() || !image.trim()) {
      Alert.alert("Error", "Category Name and Image URL are required.");
      return;
    }
    try {
      await API.post("/categories", { name, image });
      Alert.alert("Success", "Category Added");
      setName("");
      setImage("");
      fetchCategories();
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to add category");
    }
  };

  const updateCategory = async () => {
    if (!name.trim() || !image.trim()) {
      Alert.alert("Error", "Category Name and Image URL are required.");
      return;
    }
    try {
      await API.put(`/categories/${editingId}`, { name, image });
      Alert.alert("Updated", "Category Updated");
      cancelEdit();
      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setImage("");
  };

  const deleteCategory = async (id) => {
    Alert.alert("Delete", "Delete this category?", [
      { text: "Cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/categories/${id}`);
            Alert.alert("Deleted", "Category Deleted");
            fetchCategories();
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const renderEmptyComponent = () => {
    if (loading) return null; // Let main loading indicator handle it if we want, or handle here
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No categories found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <Text style={styles.heading}>Categories</Text>

      {/* INPUTS */}
      <TextInput
        placeholder="Category Name"
        placeholderTextColor={colors.textLight}
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <View style={styles.imagePickerRow}>
        <TextInput
          placeholder="Category Image URL"
          placeholderTextColor={colors.textLight}
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          value={image}
          onChangeText={setImage}
        />
        <TouchableOpacity style={styles.pickerBtn} onPress={pickImage} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color={colors.card} size="small" />
          ) : (
            <Text style={styles.pickerBtnText}>Pick</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* BUTTONS */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.button, editingId ? { flex: 1, marginRight: spacing.sm } : { width: '100%' }]}
          onPress={() => (editingId ? updateCategory() : addCategory())}
        >
          <Text style={styles.buttonText}>{editingId ? "Update Category" : "Add Category"}</Text>
        </TouchableOpacity>
        
        {editingId && (
          <TouchableOpacity
            style={[styles.button, { flex: 1, backgroundColor: colors.danger, marginLeft: spacing.sm }]}
            onPress={cancelEdit}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* LIST */}
      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            categories.length === 0 ? styles.emptyList : { paddingBottom: spacing.xxl }
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListEmptyComponent={renderEmptyComponent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
              </View>

              {/* EDIT */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  setEditingId(item._id);
                  setName(item.name);
                  setImage(item.image);
                }}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>

              {/* DELETE */}
              <TouchableOpacity style={styles.deleteButton} onPress={() => deleteCategory(item._id)}>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  heading: {
    ...typography.h1,
    marginBottom: spacing.lg,
    color: colors.text,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
  },
  buttonText: {
    color: colors.card,
    ...typography.subtitle,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 55,
    height: 55,
    borderRadius: radius.md,
    marginRight: spacing.md,
    backgroundColor: colors.background,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
  },
  editButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    marginRight: spacing.xs,
  },
  deleteButton: {
    backgroundColor: colors.danger,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  actionText: {
    color: colors.card,
    ...typography.caption,
    fontFamily: fonts.bold,
  },
  imagePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  pickerBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginLeft: spacing.sm,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 70,
  },
  pickerBtnText: {
    color: colors.card,
    ...typography.subtitle,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textLight,
  },
  emptyList: {
    flexGrow: 1,
    justifyContent: "center",
  },
});