import React, {
  useEffect,
  useState,
} from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";

import axios from "axios";

import {
  useAuth,
} from "../../src/context/AuthContext";

export default function ProductsScreen() {

  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [
    categories,
    setCategories,
  ] = useState([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const [
    categoryImage,
    setCategoryImage,
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [stock, setStock] =
    useState("");

  const [image, setImage] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [
    originalPrice,
    setOriginalPrice,
  ] = useState("");

  const [
    discountPercent,
    setDiscountPercent,
  ] = useState(0);

  const [
    rating,
    setRating,
  ] = useState("");

  const [
    numReviews,
    setNumReviews,
  ] = useState("");

  const [
    deliveryDays,
    setDeliveryDays,
  ] = useState("");

  const [
    offers,
    setOffers,
  ] = useState("");

  const [
    editingId,
    setEditingId,
  ] = useState(null);

  useEffect(() => {

    fetchProducts();

    fetchCategories();

  }, []);

  const config = {

    headers: {

      Authorization:
        `Bearer ${user.token}`,

    },

  };

  const fetchProducts =
    async () => {

      try {

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products"

          );

        setProducts(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };
  const fetchCategories =
    async () => {

      try {

        const response =
          await axios.get(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/categories"

          );

        setCategories(
          response.data
        );

      } catch (error) {

        console.log(error);

      }

    };
  useEffect(() => {

    if (

      originalPrice &&
      price

    ) {

      const original =
        parseFloat(
          originalPrice
        );

      const selling =
        parseFloat(price);

      if (
        original > selling
      ) {

        const discount =

          Math.round(

            (
              (
                original -
                selling
              ) /

              original
            ) * 100
          );

        setDiscountPercent(
          discount
        );

      } else {

        setDiscountPercent(0);

      }

    }

  }, [

    originalPrice,

    price,

  ]);
  const addProduct =
    async () => {

      try {

        const productData = {

          name,

          brand,

          category:
            selectedCategory,

          categoryImage,

          price,

          stock,

          image,

          description,

          originalPrice,

          discountPercent,

          rating,

          numReviews,

          deliveryDays,

          offers:
            offers.split(","),

          inStock:
            stock > 0,

        };

        if (editingId) {

          await axios.put(

            `https://e-commerce-mern-stack-0okr.onrender.com/api/products/${editingId}`,

            productData,

            config

          );

          Alert.alert(
            "Updated",
            "Product Updated"
          );

        } else {

          await axios.post(

            "https://e-commerce-mern-stack-0okr.onrender.com/api/products",

            productData,

            config

          );

          Alert.alert(
            "Success",
            "Product Added"
          );

        }

        fetchProducts();

        setName("");

        setBrand("");

        setSelectedCategory("");

        setCategoryImage("");

        setPrice("");

        setStock("");

        setImage("");

        setDescription("");

        setOriginalPrice("");

        setDiscountPercent("");

        setRating("");

        setNumReviews("");

        setDeliveryDays("");

        setOffers("");

        setEditingId(null);

      } catch (error) {

        console.log(error);

      }

    };

  const deleteProduct =
    async (id) => {

      try {

        await axios.delete(

          `https://e-commerce-mern-stack-0okr.onrender.com/api/products/${id}`,

          config

        );

        Alert.alert(
          "Deleted",
          "Product Deleted"
        );

        fetchProducts();

      } catch (error) {

        console.log(error);

      }

    };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
      >

        <Text style={styles.heading}>

          {editingId
            ? "Edit Product"
            : "Add Product"}

        </Text>

        <TextInput
          placeholder="Product Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

        <TextInput
          placeholder="Brand"
          style={styles.input}
          value={brand}
          onChangeText={setBrand}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 15 }}
        >

          {categories.map(
            (item) => (

              <TouchableOpacity

                key={item._id}

                style={{

                  paddingVertical: 10,

                  paddingHorizontal: 18,

                  backgroundColor:

                    selectedCategory ===
                      item._id

                      ? "#2874f0"

                      : "#f1f1f1",

                  borderRadius: 30,

                  marginRight: 10,

                }}

                onPress={() => {
                  setSelectedCategory(item._id);
                  setCategoryImage(item.image); // Auto-fill category image
                }}

              >

                <Text
                  style={{

                    color:

                      selectedCategory ===
                        item._id

                        ? "white"

                        : "#111",

                    fontWeight: "bold",

                  }}
                >

                  {item.name}

                </Text>

              </TouchableOpacity>

            )
          )}

        </ScrollView>



        <TextInput
          placeholder="Price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Stock"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />

        <TextInput
          placeholder="Product Image URL"
          style={styles.input}
          value={image}
          onChangeText={setImage}
        />

        <TextInput
          placeholder="Original Price"
          style={styles.input}
          value={originalPrice}
          onChangeText={
            setOriginalPrice
          }
        />

        <TextInput

          placeholder="Discount %"

          style={styles.input}


          value={String(
            discountPercent
          )}

          editable={false}

        />

        <TextInput
          placeholder="Rating (4.4)"
          style={styles.input}
          value={rating}
          onChangeText={
            setRating
          }
        />

        <TextInput
          placeholder="Reviews Count"
          style={styles.input}
          value={numReviews}
          onChangeText={
            setNumReviews
          }
        />

        <TextInput
          placeholder="Delivery Days"
          style={styles.input}
          value={deliveryDays}
          onChangeText={
            setDeliveryDays
          }
        />

        <TextInput
          placeholder="Offers (comma separated)"
          style={styles.input}
          value={offers}
          onChangeText={
            setOffers
          }
        />

        <TextInput
          placeholder="Description"
          style={[
            styles.input,
            {
              height: 100,
            },
          ]}
          multiline
          value={description}
          onChangeText={
            setDescription
          }
        />

        <TouchableOpacity

          style={styles.addButton}

          onPress={addProduct}

        >

          <Text style={styles.buttonText}>

            {editingId
              ? "Update Product"
              : "Add Product"}

          </Text>

        </TouchableOpacity>

        <Text style={styles.heading}>
          All Products
        </Text>

        <FlatList

          data={products}

          keyExtractor={(item) =>
            item._id
          }

          scrollEnabled={false}

          renderItem={({ item }) => (

            <View style={styles.card}>

              <Image

                source={{
                  uri: item.image,
                }}

                style={styles.image}

              />

              <View
                style={{
                  flex: 1,
                }}
              >

                <Text style={styles.name}>
                  {item.name}
                </Text>

                <Text>
                  ₹ {item.price}
                </Text>

                <Text>
                  Stock: {item.stock}
                </Text>

               <Text>{item.category?.name || "No Category"}</Text>

              </View>

              <TouchableOpacity

                style={styles.editButton}

                onPress={() => {

                  setEditingId(
                    item._id
                  );

                  setName(
                    item.name
                  );

                  setBrand(
                    item.brand
                  );

                  setSelectedCategory(item.category?._id || item.category);
                  setCategoryImage(item.categoryImage || "");

                  setCategoryImage(

                    item.categoryImage || ""

                  );

                  setPrice(
                    String(
                      item.price
                    )
                  );

                  setStock(
                    String(
                      item.stock
                    )
                  );

                  setImage(
                    item.image
                  );

                  setDescription(

                    item.description

                  );

                  setOriginalPrice(

                    String(
                      item.originalPrice || ""
                    )

                  );

                  setDiscountPercent(

                    String(
                      item.discountPercent || ""
                    )

                  );

                  setRating(

                    String(
                      item.rating || ""
                    )

                  );

                  setNumReviews(

                    String(
                      item.numReviews || ""
                    )

                  );

                  setDeliveryDays(

                    item.deliveryDays || ""

                  );

                  setOffers(

                    item.offers
                      ? item.offers.join(",")
                      : ""

                  );

                }}

              >

                <Text style={styles.buttonText}>
                  Edit
                </Text>

              </TouchableOpacity>

              <TouchableOpacity

                style={styles.deleteButton}

                onPress={() =>
                  deleteProduct(
                    item._id
                  )
                }

              >

                <Text style={styles.buttonText}>
                  Delete
                </Text>

              </TouchableOpacity>

            </View>

          )}

        />

      </ScrollView>

    </SafeAreaView>

  );

}

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

      backgroundColor:
        "#f8f9fd",

      padding: 15,

    },

    heading: {

      fontSize: 30,

      fontWeight: "bold",

      marginBottom: 18,

      marginTop: 10,

      color: "#111",

    },

    input: {

      backgroundColor:
        "white",

      padding: 16,

      borderRadius: 16,

      marginBottom: 14,

      fontSize: 16,

      elevation: 2,

    },

    addButton: {

      backgroundColor:
        "#2874f0",

      padding: 18,

      borderRadius: 16,

      alignItems: "center",

      marginBottom: 25,

      elevation: 3,

    },

    buttonText: {

      color: "white",

      fontWeight: "bold",

      fontSize: 16,

    },

    card: {

      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        "white",

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

      fontWeight: "bold",

      color: "#111",

      marginBottom: 4,

    },

    editButton: {

      backgroundColor:
        "#ff9800",

      padding: 10,

      borderRadius: 10,

      marginRight: 8,

    },

    deleteButton: {

      backgroundColor:
        "#f44336",

      padding: 10,

      borderRadius: 10,

    },

  });