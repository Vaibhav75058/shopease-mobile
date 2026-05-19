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

import { useAuth } from "../../src/context/AuthContext";

export default function ProductsScreen() {

  const { user } = useAuth();

  const [products, setProducts] =
    useState([]);

  const [name, setName] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [category, setCategory] =
    useState("");

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
  ] = useState("");

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
  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {

    fetchProducts();

  }, []);

  const config = {

    headers: {

      Authorization:
        `Bearer ${user.token}`,

    },

  };

  const fetchProducts = async () => {

    try {

      const response =
        await axios.get(
          "https://e-commerce-mern-stack-0okr.onrender.com/api/products"
        );

      setProducts(response.data);

    } catch (error) {

      console.log(error);

    }

  };

  const addProduct = async () => {

    try {

      const productData = {

        name,

        brand,

        category,

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

      setCategory("");

      setPrice("");

      setStock("");

      setImage("");

      setDescription("");

      setEditingId(null);

    } catch (error) {

      console.log(error);

    }

  };

  const deleteProduct = async (id) => {

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

      <ScrollView>

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

        <TextInput
          placeholder="Category"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          placeholder="Price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
        />

        <TextInput
          placeholder="Stock"
          style={styles.input}
          value={stock}
          onChangeText={setStock}
        />

        <TextInput
          placeholder="Image URL"
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
          value={discountPercent}
          onChangeText={
            setDiscountPercent
          }
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
          onChangeText={setDescription}
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

          keyExtractor={(item) => item._id}

          scrollEnabled={false}

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

                <Text>
                  ₹ {item.price}
                </Text>

                <Text>
                  Stock: {item.stock}
                </Text>

              </View>

              <TouchableOpacity

                style={styles.editButton}

                onPress={() => {

                  setEditingId(item._id);

                  setName(item.name);

                  setBrand(item.brand);

                  setCategory(item.category);

                  setPrice(
                    String(item.price)
                  );

                  setStock(
                    String(item.stock)
                  );

                  setImage(item.image);

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
                  deleteProduct(item._id)
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

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#fff",

    padding: 15,

  },

  heading: {

    fontSize: 28,

    fontWeight: "bold",

    marginBottom: 15,

    marginTop: 10,

  },

  input: {

    backgroundColor: "#f5f5f5",

    padding: 15,

    borderRadius: 10,

    marginBottom: 12,

  },

  addButton: {

    backgroundColor: "#e94560",

    padding: 15,

    borderRadius: 12,

    alignItems: "center",

    marginBottom: 25,

  },

  buttonText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

  },

  card: {

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: "#f5f5f5",

    padding: 12,

    borderRadius: 12,

    marginBottom: 12,

  },

  image: {

    width: 70,

    height: 70,

    borderRadius: 10,

    marginRight: 10,

  },

  name: {

    fontSize: 16,

    fontWeight: "bold",

  },

  editButton: {

    backgroundColor: "orange",

    padding: 10,

    borderRadius: 8,

    marginRight: 8,

  },

  deleteButton: {

    backgroundColor: "red",

    padding: 10,

    borderRadius: 8,

  },

});