import React, {
  useState,
} from "react";

import {
  SafeAreaView,
} from "react-native-safe-area-context";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import axios from "axios";

export default function ChatBotScreen() {

  const [message, setMessage] =
    useState("");

  const [messages, setMessages] =
    useState([

      {
        type: "bot",

        text:
          "Hello 👋 I am your AI shopping assistant. Ask me about products 😄",
      },

    ]);

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {

      type: "user",

      text: message,

    };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    try {

      const response =
        await axios.post(

          "https://e-commerce-mern-stack-0okr.onrender.com/api/chat",

          {
            message,
          }

        );

      const botMessage = {

        type: "bot",

        text: response.data.reply,

      };

      setMessages((prev) => [
        ...prev,
        botMessage,
      ]);

    } catch (error) {

      console.log(error);

      const errorMessage = {

        type: "bot",

        text:
          "Something went wrong 😢",

      };

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ]);

    }

    setMessage("");

  };

  return (

    <SafeAreaView
      style={styles.container}
    >

      <KeyboardAvoidingView

        style={styles.container}

        behavior={
          Platform.OS === "ios"
            ? "padding"
            : "height"
        }

      >

        <FlatList

          data={messages}

          keyExtractor={(_, index) =>
            index.toString()
          }

          showsVerticalScrollIndicator={false}

          renderItem={({ item }) => (

            <View

              style={[

                styles.messageBox,

                item.type === "user"

                  ? styles.userMessage

                  : styles.botMessage,

              ]}

            >

              <Text

                style={[

                  styles.messageText,

                  item.type === "user" && {
                    color: "white",
                  },

                ]}

              >

                {item.text}

              </Text>

            </View>

          )}

        />

        <View style={styles.inputContainer}>

          <TextInput

            placeholder="Ask something..."

            style={styles.input}

            value={message}

            onChangeText={setMessage}

          />

          <TouchableOpacity

            style={styles.sendButton}

            onPress={sendMessage}

          >

            <Text style={styles.sendText}>
              Send
            </Text>

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>

  );

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    backgroundColor: "#fff",

    padding: 12,

  },

  messageBox: {

    padding: 14,

    borderRadius: 14,

    marginBottom: 12,

    maxWidth: "80%",

  },

  userMessage: {

    backgroundColor: "#e94560",

    alignSelf: "flex-end",

  },

  botMessage: {

    backgroundColor: "#f1f1f1",

    alignSelf: "flex-start",

  },

  messageText: {

    fontSize: 16,

    color: "#000",

  },

  inputContainer: {

    flexDirection: "row",

    alignItems: "center",

    marginTop: 10,

  },

  input: {

    flex: 1,

    backgroundColor: "#f5f5f5",

    padding: 14,

    borderRadius: 12,

    fontSize: 16,

  },

  sendButton: {

    backgroundColor: "#e94560",

    paddingHorizontal: 18,

    paddingVertical: 14,

    borderRadius: 12,

    marginLeft: 10,

  },

  sendText: {

    color: "white",

    fontWeight: "bold",

    fontSize: 16,

  },

});