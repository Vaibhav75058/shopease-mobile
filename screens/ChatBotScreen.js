import React, { useState, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Image
} from "react-native";
import API from "../src/services/api";
import { colors, typography, spacing, radius, shadows, fonts } from "../src/theme";

export default function ChatBotScreen({ navigation }) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: "initial-bot-msg",
      type: "bot",
      text: "Hello 👋 I am your ShopEase AI assistant. Ask me about products or your order status! 😄",
      products: []
    },
  ]);

  const generateId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const sendMessage = async () => {
    const userMsgText = message.trim();
    if (!userMsgText) return;

    const userMessage = {
      id: generateId(),
      type: "user",
      text: userMsgText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Build history payload for context memory
    const historyPayload = messages.slice(-10).map(msg => ({
      role: msg.type === "user" ? "user" : "assistant",
      text: msg.text
    }));

    try {
      const response = await API.post("/chat", {
        message: userMsgText,
        history: historyPayload
      });

      if (
        response.data &&
        response.data.reply &&
        !response.data.reply.toLowerCase().includes("something went wrong") &&
        !response.data.reply.toLowerCase().includes("ai error") &&
        !response.data.reply.toLowerCase().includes("error")
      ) {
        const botMessage = {
          id: generateId(),
          type: "bot",
          text: response.data.reply,
          products: response.data.products || []
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid or error response from chatbot API");
      }
    } catch (error) {
      console.log("ChatBot API error, using local fallback:", error);

      const getLocalBotResponse = (userMsg) => {
        const msg = userMsg.toLowerCase();
        if (
          msg.includes("hello") ||
          msg.includes("hi") ||
          msg.includes("hey") ||
          msg.includes("greetings")
        ) {
          return "Hello! I'm ShopEase's AI assistant. I can help you find products, track orders, or answer questions about payments, returns, and delivery. How can I help you today?";
        }
        if (
          msg.includes("product") ||
          msg.includes("item") ||
          msg.includes("category") ||
          msg.includes("buy") ||
          msg.includes("search") ||
          msg.includes("shop")
        ) {
          return "You can explore all our products by category on the homepage, or use the search bar at the top of the Home screen to find specific items!";
        }
        if (
          msg.includes("order") ||
          msg.includes("track") ||
          msg.includes("status") ||
          msg.includes("package")
        ) {
          return "To track your order, go to the 'Profile' or 'Account' tab, tap on 'My Orders', and select the order you want to view.";
        }
        if (
          msg.includes("refund") ||
          msg.includes("return") ||
          msg.includes("exchange") ||
          msg.includes("cancel")
        ) {
          return "We support easy returns and refunds within 7 days of delivery! Please head to our Help Center in the app or contact support to request a return.";
        }
        if (
          msg.includes("payment") ||
          msg.includes("pay") ||
          msg.includes("upi") ||
          msg.includes("card") ||
          msg.includes("cod") ||
          msg.includes("cash") ||
          msg.includes("price")
        ) {
          return "We accept all major UPI apps, credit/debit cards, net banking, and Cash on Delivery (COD).";
        }
        if (
          msg.includes("contact") ||
          msg.includes("support") ||
          msg.includes("help") ||
          msg.includes("human") ||
          msg.includes("agent") ||
          msg.includes("call") ||
          msg.includes("phone") ||
          msg.includes("email")
        ) {
          return "You can contact our support team at support@shopease.com or call us at 1800-123-4567. We are available 24/7!";
        }
        return "I'm currently running in offline helper mode, but I can assist you with products, orders, returns, payments, or contacting support! What would you like to know?";
      };

      await new Promise(resolve => setTimeout(resolve, 600));

      const fallbackMsg = getLocalBotResponse(userMsgText);
      const botMessage = {
        id: generateId(),
        type: "bot",
        text: fallbackMsg,
        products: []
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const isSendDisabled = !message.trim() || isTyping;

  const renderItem = ({ item }) => {
    const isUser = item.type === "user";
    return (
      <View style={styles.messageRow}>
        <View
          style={[
            styles.messageBox,
            isUser ? styles.userMessage : styles.botMessage,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isUser ? styles.userMessageText : styles.botMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>

        {/* CLICKABLE HORIZONTAL PRODUCT CARDS */}
        {!isUser && item.products && item.products.length > 0 && (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={item.products}
            keyExtractor={(prod) => prod._id}
            contentContainerStyle={styles.productsCarousel}
            renderItem={({ item: prod }) => (
              <TouchableOpacity
                style={styles.productCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("ProductDetails", { product: prod })}
              >
                <Image source={{ uri: prod.image }} style={styles.productImage} />
                <View style={styles.productInfo}>
                  <Text numberOfLines={1} style={styles.productName}>
                    {prod.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    {`₹ ${prod.price?.toLocaleString("en-IN")}`}
                  </Text>
                  <View style={styles.viewDetailsButton}>
                    <Text style={styles.viewDetailsText}>{"View Details"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      {/* PREMIUM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Image
            source={require("../assets/icons/back-arrow.png")}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{"ShopEase Assistant"}</Text>
          <View style={styles.onlineContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>{"Online"}</Text>
          </View>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={renderItem}
          ListFooterComponent={
            isTyping ? (
              <View style={[styles.messageBox, styles.botMessage, styles.typingBox]}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.typingText}>{"Typing..."}</Text>
              </View>
            ) : null
          }
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Ask something..."
            placeholderTextColor={colors.textLight}
            style={styles.input}
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, isSendDisabled && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={isSendDisabled}
            activeOpacity={0.8}
          >
            <Text style={styles.sendText}>{"Send"}</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight || "#f0f0f0",
    backgroundColor: colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerIcon: {
    width: 16,
    height: 16,
    tintColor: colors.textPrimary,
    resizeMode: "contain",
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: fonts.semiBold || "Poppins_600SemiBold",
    color: colors.textPrimary,
  },
  onlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4cd964",
    marginRight: 4,
  },
  onlineText: {
    fontSize: 10,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.textSecondary,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },
  listContent: {
    paddingVertical: spacing.md,
    paddingBottom: 40,
  },
  messageRow: {
    marginBottom: spacing.md,
    width: "100%",
  },
  messageBox: {
    padding: spacing.md,
    borderRadius: radius.lg || 12,
    maxWidth: "80%",
    ...shadows.sm,
  },
  userMessage: {
    backgroundColor: colors.primary,
    alignSelf: "flex-end",
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: colors.surface,
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: fonts.regular || "Poppins_400Regular",
    lineHeight: 20,
  },
  userMessageText: {
    color: "white",
  },
  botMessageText: {
    color: colors.textPrimary,
  },
  typingBox: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    borderBottomLeftRadius: 4,
    backgroundColor: colors.surface,
  },
  typingText: {
    fontSize: 12,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  productsCarousel: {
    paddingVertical: spacing.sm,
    paddingLeft: spacing.xs,
    gap: 12,
    marginTop: spacing.xs,
  },
  productCard: {
    width: 150,
    backgroundColor: colors.surface,
    borderRadius: radius.md || 8,
    borderWidth: 1,
    borderColor: colors.borderLight || "#f0f0f0",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    marginBottom: 4,
  },
  productImage: {
    width: "100%",
    height: 100,
    backgroundColor: colors.background,
  },
  productInfo: {
    padding: spacing.sm,
  },
  productName: {
    fontSize: 12,
    fontFamily: fonts.medium || "Poppins_500Medium",
    color: colors.textPrimary,
  },
  productPrice: {
    fontSize: 12,
    fontFamily: fonts.bold || "Poppins_700Bold",
    color: colors.primary,
    marginTop: 2,
  },
  viewDetailsButton: {
    marginTop: spacing.xs + 2,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.sm || 4,
    paddingVertical: 4,
    alignItems: "center",
  },
  viewDetailsText: {
    fontSize: 10,
    fontFamily: fonts.bold || "Poppins_700Bold",
    color: colors.primary,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    height: 48,
    borderRadius: radius.round || 24,
    fontSize: 14,
    fontFamily: fonts.regular || "Poppins_400Regular",
    color: colors.textPrimary,
    borderWidth: 1.5,
    borderColor: colors.borderLight || "#f0f0f0",
  },
  sendButton: {
    backgroundColor: colors.primary,
    height: 48,
    borderRadius: radius.round || 24,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
    elevation: 2,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  sendButtonDisabled: {
    backgroundColor: "#e8ecf0",
    shadowOpacity: 0,
    elevation: 0,
  },
  sendText: {
    color: "white",
    fontSize: 14,
    fontFamily: fonts.bold || "Poppins_700Bold",
  },
});