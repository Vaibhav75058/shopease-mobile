import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import API from "../../src/services/api";
import { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";

export default function UsersScreen() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const response = await API.get("/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers(true);
  };

  const deleteUser = async (id) => {
    Alert.alert("Confirm Delete", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await API.delete(`/users/${id}`);
            Alert.alert("Success", "User Deleted");
            fetchUsers();
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
  };

  const filteredUsers = users.filter((user) => {
    if (!user) return false;
    const userName = user.name ? user.name.toLowerCase() : "";
    const userEmail = user.email ? user.email.toLowerCase() : "";
    const query = search.toLowerCase();
    return userName.includes(query) || userEmail.includes(query);
  });

  const renderEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No users found.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom", "left", "right"]}>
      <Text style={styles.heading}>All Users</Text>

      {/* SEARCH BAR */}
      <TextInput
        placeholder="🔍 Search users by name or email..."
        placeholderTextColor={colors.textLight}
        style={styles.searchBar}
        value={search}
        onChangeText={setSearch}
      />

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            filteredUsers.length === 0 ? styles.emptyList : { paddingBottom: spacing.xxl }
          ]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} />
          }
          ListEmptyComponent={renderEmptyComponent}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.email}>{item.email}</Text>
              </View>

              {item.isAdmin ? (
                <View style={styles.adminBadge}>
                  <Text style={styles.adminText}>ADMIN</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteUser(item._id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
              )}
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
  searchBar: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    padding: spacing.md,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  name: {
    ...typography.subtitle,
    color: colors.text,
    marginBottom: 4,
  },
  email: {
    ...typography.body,
    color: colors.textLight,
  },
  adminBadge: {
    backgroundColor: colors.success || "green",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  adminText: {
    color: colors.card,
    ...typography.caption,
    fontFamily: fonts.bold,
  },
  deleteButton: {
    backgroundColor: colors.danger || "red",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  buttonText: {
    color: colors.card,
    ...typography.caption,
    fontFamily: fonts.bold,
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