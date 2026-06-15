import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";
import * as ImagePicker from "expo-image-picker";

import API from "../../src/services/api";


// ─── Reusable Input Field with Label ────────────────────────
const FormField = ({
  label,
  required,
  icon,
  children,
  hint,
}) => (
  <View style={styles.fieldWrapper}>
    <View style={styles.labelRow}>
      {icon ? <Text style={styles.fieldIcon}>{icon}</Text> : null}
      <Text style={styles.fieldLabel}>
        {label}
        {required ? <Text style={styles.requiredStar}> *</Text> : null}
      </Text>
    </View>
    {children}
    {hint ? <Text style={styles.fieldHint}>{hint}</Text> : null}
  </View>
);

// ─── Section Card ───────────────────────────────────────────
const SectionCard = ({ title, icon, children }) => (
  <View style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionDivider} />
    {children}
  </View>
);

export default function AddProductScreen({ route, navigation }) {
  const { width } = useWindowDimensions();

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryImage, setCategoryImage] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [rating, setRating] = useState("");
  const [numReviews, setNumReviews] = useState("");
  const [deliveryDays, setDeliveryDays] = useState("");
  const [offers, setOffers] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Additional Slide Images State
  const [additionalImages, setAdditionalImages] = useState([]);
  const [additionalImageUrl, setAdditionalImageUrl] = useState("");

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

  const pickAdditionalImage = async () => {
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
      setAdditionalImages((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const addAdditionalImageUrl = () => {
    if (!additionalImageUrl.trim()) return;
    if (additionalImages.length >= 6) {
      Alert.alert("Limit Reached", "You can add a maximum of 6 additional images.");
      return;
    }
    setAdditionalImages((prev) => [...prev, additionalImageUrl.trim()]);
    setAdditionalImageUrl("");
  };

  const removeAdditionalImage = (index) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    console.log("AddProductScreen useEffect triggered. editProduct param:", !!route?.params?.editProduct);
    if (route?.params?.editProduct) {
      const p = route.params.editProduct;
      console.log("Loading product for editing:", p._id, p.name);
      setEditingId(p._id);
      setName(p.name || "");
      setBrand(p.brand || "");
      setSelectedCategory(p.category?._id || p.category || "");
      setCategoryImage(p.categoryImage || "");
      setPrice(String(p.price || ""));
      setStock(String(p.stock || ""));
      setImage(p.image || "");
      
      // Parse description and extract additional images
      let desc = p.description || "";
      let addImages = [];
      const match = desc.match(/\[IMAGES_JSON\]\s*:\s*(\[.*?\])/);
      console.log("Regex match result:", match ? "FOUND" : "NOT FOUND");
      if (match) {
        try {
          addImages = JSON.parse(match[1]);
          console.log("Parsed additional images JSON:", addImages);
          desc = desc.replace(/\n*\[IMAGES_JSON\]\s*:\s*\[.*?\]/g, "").trim();
        } catch (e) {
          console.log("Error parsing images JSON from description:", e);
        }
      }
      const backendImages = p.images || [];
      const combined = [...new Set([...backendImages, ...addImages])].filter(img => img !== p.image);
      console.log("Combined additional images array:", combined);

      setAdditionalImages(combined);
      setDescription(desc);
      setOriginalPrice(String(p.originalPrice || ""));
      setDiscountPercent(p.discountPercent || 0);
      setRating(String(p.rating || ""));
      setNumReviews(String(p.numReviews || ""));
      setDeliveryDays(String(p.deliveryDays || ""));
      setOffers(p.offers ? p.offers.join(", ") : "");
      
      // Clean params to avoid re-triggering
      console.log("Cleaning editProduct param to null...");
      navigation.setParams({ editProduct: null });
    }
  }, [route?.params?.editProduct]);

  const fetchCategories = async () => {
    try {
      const response = await API.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (originalPrice && price) {
      const original = parseFloat(originalPrice);
      const selling = parseFloat(price);
      if (original > selling) {
        const discount = Math.round(
          ((original - selling) / original) * 100
        );
        setDiscountPercent(discount);
      } else {
        setDiscountPercent(0);
      }
    }
  }, [originalPrice, price]);

  const resetForm = () => {
    setName("");
    setBrand("");
    setSelectedCategory("");
    setCategoryImage("");
    setPrice("");
    setStock("");
    setImage("");
    setDescription("");
    setOriginalPrice("");
    setDiscountPercent(0);
    setRating("");
    setNumReviews("");
    setDeliveryDays("");
    setOffers("");
    setEditingId(null);
    setAdditionalImages([]);
    setAdditionalImageUrl("");
  };

  const addProduct = async () => {
    try {
      if (!name.trim() || !price || !stock || !image.trim() || !description.trim()) {
        Alert.alert(
          "Missing Fields",
          "Please fill in all required fields marked with *"
        );
        return;
      }

      setSubmitting(true);

      // Serialize additional images fallback in description
      let finalDescription = description.trim();
      if (additionalImages.length > 0) {
        finalDescription = `${finalDescription}\n\n[IMAGES_JSON]:${JSON.stringify(additionalImages)}`;
      }

      const productData = {
        name,
        brand,
        category: selectedCategory,
        categoryImage,
        price,
        stock,
        image,
        description: finalDescription,
        images: additionalImages, // send directly in case backend supports it
        originalPrice,
        discountPercent,
        rating,
        numReviews,
        deliveryDays,
        offers: offers.trim() ? offers.split(",").map((o) => o.trim()) : [],
        inStock: stock > 0,
      };

      const wasEditing = !!editingId;
      if (editingId) {
        await API.put(`/products/${editingId}`, productData);
        Alert.alert("✅ Updated", "Product has been updated successfully.");
      } else {
        await API.post("/products", productData);
        Alert.alert("✅ Success", "Product has been added to the catalog.");
      }

      resetForm();
      if (wasEditing) {
        navigation.navigate("Products");
      }

    } catch (error) {
      console.log('Add product error:', error?.response?.status, error?.response?.data || error.message);
      const msg = error?.response?.data?.message || error?.response?.data?.error || "Something went wrong. Please try again.";
      Alert.alert("Error", msg);
    } finally {
      setSubmitting(false);
    }
  };

  // Count filled fields for progress
  const totalRequired = 5;
  const filledRequired = [name.trim(), price, stock, image.trim(), description.trim()].filter(Boolean).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* ─── Header ──────────────────────────────── */}
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.heading}>
              {editingId ? "✏️ Edit Product" : "📦 New Product"}
            </Text>
            <Text style={styles.subHeading}>
              Fill in the details to {editingId ? "update" : "add"} a product
            </Text>
          </View>
        </View>

        {/* ─── Progress Indicator ───────────────────── */}
        <View style={styles.progressCard}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressLabel}>Required fields</Text>
            <Text style={styles.progressCount}>
              {filledRequired}/{totalRequired}
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(filledRequired / totalRequired) * 100}%` },
                filledRequired === totalRequired && styles.progressBarComplete,
              ]}
            />
          </View>
        </View>

        {/* ═══════════════════════════════════════════ */}
        {/* SECTION 1: Basic Information               */}
        {/* ═══════════════════════════════════════════ */}
        <SectionCard title="Basic Information" icon="📋">
          <FormField label="Product Name" required icon="🏷️">
            <TextInput
              placeholder="e.g. iPhone 15 Pro Max"
              style={[styles.input, submitting && !name.trim() && { borderColor: 'red' }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor="#aaa"
            />
          </FormField>

          <FormField label="Brand" icon="🏢">
            <TextInput
              placeholder="e.g. Apple, Samsung, Nike"
              style={styles.input}
              value={brand}
              onChangeText={setBrand}
              placeholderTextColor="#aaa"
            />
          </FormField>

          <FormField
            label="Category"
            icon="📂"
            hint="Select one category for this product"
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 4 }}
            >
              {categories.map((item) => {
                const isSelected = selectedCategory === item._id;
                return (
                  <TouchableOpacity
                    key={item._id}
                    style={[
                      styles.categoryChip,
                      isSelected && styles.categoryChipSelected,
                    ]}
                    onPress={() => {
                      setSelectedCategory(item._id);
                      setCategoryImage(item.image);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected && styles.categoryChipTextSelected,
                      ]}
                    >
                      {item.name}
                    </Text>
                    {isSelected && <Text style={styles.chipCheck}> ✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </FormField>

          <FormField label="Description" required icon="📝">
            <TextInput
              placeholder="Write a detailed product description..."
              style={[styles.input, styles.textArea, submitting && !description.trim() && { borderColor: 'red' }]}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              placeholderTextColor="#aaa"
            />
          </FormField>
        </SectionCard>

        {/* ═══════════════════════════════════════════ */}
        {/* SECTION 2: Media / Image                   */}
        {/* ═══════════════════════════════════════════ */}
        <SectionCard title="Product Image" icon="🖼️">
          {/* Image Preview */}
          {image ? (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: image }}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                style={styles.removeImageBtn}
                onPress={() => setImage("")}
              >
                <Text style={styles.removeImageText}>✕</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.imagePlaceholder, submitting && !image && { borderColor: 'red' }]}
              onPress={pickImage}
              disabled={uploading}
              activeOpacity={0.7}
            >
              {uploading ? (
                <View style={styles.uploadingContainer}>
                  <ActivityIndicator color={colors.primary} size="large" />
                  <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
              ) : (
                <View style={styles.uploadPrompt}>
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadTitle}>Tap to upload image</Text>
                  <Text style={styles.uploadSubtitle}>JPG, PNG • Max 5MB</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <FormField label="Or paste image URL" required icon="🔗">
            <View style={styles.urlInputRow}>
              <TextInput
                placeholder="https://example.com/image.jpg"
                style={[styles.input, { flex: 1, marginBottom: 0 }, submitting && !image.trim() && { borderColor: 'red' }]}
                value={image}
                onChangeText={setImage}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={pickImage}
                disabled={uploading}
                activeOpacity={0.7}
              >
                {uploading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.pickerBtnText}>📁 Pick</Text>
                )}
              </TouchableOpacity>
            </View>
          </FormField>

          {/* ─── Additional Slide Images Sub-section ─── */}
          <View style={styles.subSectionDivider} />
          
          <Text style={styles.sectionSubtitleText}>
            🖼️ Additional Carousel Images (Optional)
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.additionalImagesList}
          >
            {additionalImages.map((uri, idx) => (
              <View key={idx} style={styles.additionalImagePreviewContainer}>
                <Image source={{ uri }} style={styles.additionalImagePreview} />
                <TouchableOpacity
                  style={styles.removeAdditionalImageBtn}
                  onPress={() => removeAdditionalImage(idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeAdditionalImageText}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
            
            {additionalImages.length < 6 && (
              <TouchableOpacity
                style={styles.addAdditionalImagePlaceholder}
                onPress={pickAdditionalImage}
                activeOpacity={0.7}
              >
                <Text style={styles.addAdditionalImageIcon}>➕</Text>
                <Text style={styles.addAdditionalImageTitle}>Add Image</Text>
              </TouchableOpacity>
            )}
          </ScrollView>

          <FormField
            label="Or paste additional image URL"
            icon="🔗"
            hint="Paste URL and tap '+' to add image to the slides list"
          >
            <View style={styles.urlInputRow}>
              <TextInput
                placeholder="https://example.com/slide-image.jpg"
                style={[styles.input, { flex: 1, marginBottom: 0 }]}
                value={additionalImageUrl}
                onChangeText={setAdditionalImageUrl}
                placeholderTextColor="#aaa"
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.pickerBtn}
                onPress={addAdditionalImageUrl}
                activeOpacity={0.7}
              >
                <Text style={styles.pickerBtnText}>➕ Add</Text>
              </TouchableOpacity>
            </View>
          </FormField>
        </SectionCard>

        {/* ═══════════════════════════════════════════ */}
        {/* SECTION 3: Pricing & Inventory             */}
        {/* ═══════════════════════════════════════════ */}
        <SectionCard title="Pricing & Inventory" icon="💰">
          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <FormField label="Selling Price" required icon="💵">
                <TextInput
                  placeholder="₹ 0.00"
                  style={[styles.input, submitting && !price && { borderColor: 'red' }]}
              value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </FormField>
            </View>
            <View style={styles.halfCol}>
              <FormField label="Original Price" icon="💸">
                <TextInput
                  placeholder="₹ 0.00"
                  style={styles.input}
                  value={originalPrice}
                  onChangeText={setOriginalPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </FormField>
            </View>
          </View>

          {/* Discount Badge */}
          {discountPercent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountBadgeText}>
                🎉 {discountPercent}% OFF — Customers will save ₹
                {(parseFloat(originalPrice || 0) - parseFloat(price || 0)).toFixed(0)}
              </Text>
            </View>
          )}

          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <FormField label="Stock Quantity" required icon="📊">
                <TextInput
                  placeholder="0"
                  style={[styles.input, submitting && !stock && { borderColor: 'red' }]}
              value={stock}
                  onChangeText={setStock}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </FormField>
            </View>
            <View style={styles.halfCol}>
              <FormField label="Discount %" icon="🏷️">
                <View style={styles.disabledInputWrapper}>
                  <Text style={styles.disabledInputText}>
                    {discountPercent}%
                  </Text>
                  <Text style={styles.autoCalcBadge}>Auto</Text>
                </View>
              </FormField>
            </View>
          </View>
        </SectionCard>

        {/* ═══════════════════════════════════════════ */}
        {/* SECTION 4: Additional Details              */}
        {/* ═══════════════════════════════════════════ */}
        <SectionCard title="Additional Details" icon="⚙️">
          <View style={styles.twoColRow}>
            <View style={styles.halfCol}>
              <FormField label="Rating" icon="⭐">
                <TextInput
                  placeholder="e.g. 4.5"
                  style={styles.input}
                  value={rating}
                  onChangeText={setRating}
                  keyboardType="decimal-pad"
                  placeholderTextColor="#aaa"
                />
              </FormField>
            </View>
            <View style={styles.halfCol}>
              <FormField label="Reviews" icon="💬">
                <TextInput
                  placeholder="e.g. 2450"
                  style={styles.input}
                  value={numReviews}
                  onChangeText={setNumReviews}
                  keyboardType="numeric"
                  placeholderTextColor="#aaa"
                />
              </FormField>
            </View>
          </View>

          <FormField
            label="Delivery Days"
            icon="🚚"
            hint="Estimated days for delivery"
          >
            <TextInput
              placeholder="e.g. 3-5 days"
              style={styles.input}
              value={deliveryDays}
              onChangeText={setDeliveryDays}
              placeholderTextColor="#aaa"
            />
          </FormField>

          <FormField
            label="Offers"
            icon="🎁"
            hint="Separate multiple offers with commas"
          >
            <TextInput
              placeholder="e.g. Bank Offer 10%, No Cost EMI"
              style={[styles.input, { minHeight: 56 }]}
              value={offers}
              onChangeText={setOffers}
              multiline
              placeholderTextColor="#aaa"
            />
          </FormField>
        </SectionCard>

        {/* ═══════════════════════════════════════════ */}
        {/* Action Buttons                              */}
        {/* ═══════════════════════════════════════════ */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetForm}
            activeOpacity={0.7}
          >
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
              filledRequired < totalRequired && styles.submitButtonIncomplete,
            ]}
            onPress={addProduct}
            disabled={submitting}
            activeOpacity={0.8}
          >
            {submitting ? (
              <View style={styles.submittingRow}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.submitButtonText}>
                  {" "}{editingId ? "Updating..." : "Adding..."}
                </Text>
              </View>
            ) : (
              <Text style={styles.submitButtonText}>
                {editingId ? "✏️ Update Product" : "🚀 Publish Product"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ═══════════════════════════════════════════════════════
//  STYLES
// ═══════════════════════════════════════════════════════
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // ─── Header ─────────────────────────
  headerRow: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 4,
  },
  heading: {
    ...typography.h1,
    color: "#1a1a2e",
    letterSpacing: -0.5,
  },
  subHeading: {
    fontSize: 14,
    color: "#8e8e93",
    marginTop: 4,
  },

  // ─── Progress Card ──────────────────
  progressCard: {
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 8,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  progressTextRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 13,
    color: "#666",
    ...typography.subtitle,
  },
  progressCount: {
    fontSize: 13,
    color: colors.primary,
    ...typography.h3,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#e8ecf0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressBarComplete: {
    backgroundColor: "#34c759",
  },

  // ─── Section Card ───────────────────
  sectionCard: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    ...typography.h3,
    color: "#1a1a2e",
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 14,
  },

  // ─── Form Field ─────────────────────
  fieldWrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  fieldIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  fieldLabel: {
    ...typography.subtitle,
    color: "#3c3c43",
  },
  requiredStar: {
    color: "#ff3b30",
    ...typography.h3,
  },
  fieldHint: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
    marginLeft: 2,
  },

  // ─── Input ──────────────────────────
  input: {
    backgroundColor: "#f8f9fb",
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: "#e8ecf0",
    color: "#1a1a2e",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
    paddingTop: 14,
  },

  // ─── Two Column Layout ──────────────
  twoColRow: {
    flexDirection: "row",
    gap: 12,
  },
  halfCol: {
    flex: 1,
  },

  // ─── Category Chips ─────────────────
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: colors.background,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  categoryChipSelected: {
    backgroundColor: "#eef4ff",
    borderColor: colors.primary,
  },
  categoryChipText: {
    color: "#555",
    ...typography.subtitle,
    fontSize: 13,
  },
  categoryChipTextSelected: {
    color: colors.primary,
  },
  chipCheck: {
    color: colors.primary,
    ...typography.h3,
    fontSize: 14,
  },

  // ─── Image Section ──────────────────
  imagePreviewContainer: {
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  imagePreview: {
    width: Dimensions.get("window").width - 72,
    height: 200,
    borderRadius: 16,
    resizeMode: "cover",
    backgroundColor: "#f0f0f0",
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  removeImageText: {
    color: "#fff",
    ...typography.h3,
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#d0d7e0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fb",
    marginBottom: 16,
  },
  uploadingContainer: {
    alignItems: "center",
  },
  uploadingText: {
    color: colors.primary,
    marginTop: 8,
    ...typography.subtitle,
  },
  uploadPrompt: {
    alignItems: "center",
  },
  uploadIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  uploadTitle: {
    ...typography.subtitle,
    color: "#3c3c43",
  },
  uploadSubtitle: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 4,
  },
  urlInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  pickerBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 75,
    elevation: 1,
  },
  pickerBtnText: {
    color: "white",
    ...typography.h3,
    fontSize: 14,
  },

  // ─── Discount Badge ─────────────────
  discountBadge: {
    backgroundColor: "#fff5f5",
    borderWidth: 1,
    borderColor: "#ffdddd",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  discountBadgeText: {
    color: "#e94560",
    ...typography.subtitle,
    fontSize: 13,
  },

  // ─── Disabled / Auto-calc input ─────
  disabledInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e8ecf0",
  },
  disabledInputText: {
    fontSize: 15,
    color: "#666",
    ...typography.subtitle,
    flex: 1,
  },
  autoCalcBadge: {
    backgroundColor: "#eef4ff",
    color: colors.primary,
    ...typography.h3,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: "hidden",
  },

  // ─── Action Buttons ─────────────────
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  resetButton: {
    flex: 1,
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#e0e0e0",
    elevation: 1,
  },
  resetButtonText: {
    color: "#555",
    ...typography.h3,
    fontSize: 15,
  },
  submitButton: {
    flex: 2.5,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonIncomplete: {
    backgroundColor: "#7aabf7",
  },
  submitButtonText: {
    color: "white",
    ...typography.h1,
    fontSize: 16,
    letterSpacing: 0.3,
  },
  submittingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  subSectionDivider: {
    height: 1,
    backgroundColor: "#e8ecf0",
    marginVertical: 18,
  },
  sectionSubtitleText: {
    ...typography.subtitle,
    color: "#1a1a2e",
    marginBottom: 12,
    fontSize: 14,
  },
  additionalImagesList: {
    marginBottom: 16,
    paddingVertical: 4,
  },
  additionalImagePreviewContainer: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e8ecf0",
    overflow: "visible",
    marginRight: 12,
  },
  additionalImagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    resizeMode: "cover",
  },
  removeAdditionalImageBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#ff3b30",
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  removeAdditionalImageText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
  },
  addAdditionalImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f9ff",
    marginRight: 12,
  },
  addAdditionalImageIcon: {
    fontSize: 18,
    color: colors.primary,
  },
  addAdditionalImageTitle: {
    fontSize: 10,
    color: colors.primary,
    marginTop: 4,
    ...typography.subtitle,
  },
});
