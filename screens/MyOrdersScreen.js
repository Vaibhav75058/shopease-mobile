import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import API from "../src/services/api";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, typography, spacing, radius, shadows } from "../src/theme";

export default function MyOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [sortByDate, setSortByDate] = useState("newest");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await API.get("/orders/myorders");
      setOrders(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return colors.success;
      case "processing": return colors.warning;
      case "cancelled": return colors.error;
      default: return colors.primary;
    }
  };

  const getFilteredAndSortedOrders = () => {
    let list = [...orders];

    if (selectedFilter === "Processing") {
      list = list.filter(order => {
        const s = order.status?.toLowerCase();
        return s === "processing" || s === "pending" || s === "shipped";
      });
    } else if (selectedFilter === "Delivered") {
      list = list.filter(order => order.status?.toLowerCase() === "delivered");
    } else if (selectedFilter === "Cancelled") {
      list = list.filter(order => order.status?.toLowerCase() === "cancelled");
    }

    list.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortByDate === "newest" ? dateB - dateA : dateA - dateB;
    });

    return list;
  };

  const filters = ["All", "Processing", "Delivered", "Cancelled"];

  const renderHeader = () => (
    <View style={styles.header}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              selectedFilter === filter && styles.filterTabActive,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.filterTextActive,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        <Text style={styles.resultsCount}>
          {getFilteredAndSortedOrders().length} Orders
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setSortByDate(prev => prev === "newest" ? "oldest" : "newest")}
        >
          <Text style={styles.sortButtonText}>
            📅 {sortByDate === "newest" ? "Newest First" : "Oldest First"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={getFilteredAndSortedOrders()}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>No Orders Yet</Text>
            <TouchableOpacity style={styles.ctaButton} onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}>
              <Text style={styles.ctaText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              navigation.navigate("OrderDetails", {
                order: item,
              })
            }
          >
            {/* PRODUCT IMAGE */}
            <Image
              source={{
                uri: item.orderItems[0]?.image,
              }}
              style={styles.image}
            />

            {/* INFO */}
            <View style={styles.info}>
              <Text numberOfLines={1} style={styles.productName}>
                {item.orderItems[0]?.name}
              </Text>
              <Text style={styles.price}>₹ {item.totalPrice.toLocaleString("en-IN")}</Text>
              <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
                {item.status}
              </Text>
              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    flexDirection: "row",
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: radius.md,
    backgroundColor: colors.border,
  },
  info: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: "space-between",
  },
  productName: {
    ...typography.h3,
    color: colors.text,
  },
  price: {
    ...typography.h2,
    color: colors.primary,
  },
  status: {
    ...typography.subtitle,
  },
  date: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyBox: {
    marginTop: 100,
    alignItems: "center",
  },
  emptyText: {
    ...typography.h2,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  ctaButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.round,
  },
  ctaText: {
    ...typography.subtitle,
    color: colors.surface,
  },
  header: {
    backgroundColor: colors.background,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || "#f0f0f0",
    marginBottom: spacing.sm,
  },
  filterScroll: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border || "#eee",
  },
  filterTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: "white",
    fontFamily: "Poppins_600SemiBold",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.xs,
  },
  resultsCount: {
    fontSize: 12,
    fontFamily: "Poppins_500Medium",
    color: colors.textSecondary,
  },
  sortButton: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border || "#eee",
  },
  sortButtonText: {
    fontSize: 11,
    fontFamily: "Poppins_500Medium",
    color: colors.text,
  },
});