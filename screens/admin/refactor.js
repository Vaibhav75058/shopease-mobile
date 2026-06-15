const fs = require('fs');

function refactorDashboard() {
  const file = 'c:/Users/Vaibhav Sharma/Desktop/vaibhav projects/SE-mobile/shopease-mobile/screens/admin/DashboardScreen.js';
  let content = fs.readFileSync(file, 'utf-8');

  // Replace emojis with Ionicons
  content = content.replace(/<Text style=\{styles\.chartIcon\}>📊<\/Text>/g, `<Ionicons name="bar-chart" size={20} color={colors.primary} style={styles.chartIcon} />`);
  content = content.replace(/<Text style=\{styles\.orderStatusIcon\}>✅<\/Text>/g, `<Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.orderStatusIcon} />`);
  content = content.replace(/<Text style=\{styles\.orderStatusIcon\}>⏳<\/Text>/g, `<Ionicons name="time" size={20} color={colors.warning} style={styles.orderStatusIcon} />`);
  content = content.replace(/<Text style=\{styles\.alertsIcon\}>⚠️<\/Text>/g, `<Ionicons name="warning" size={20} color={colors.warning} style={styles.alertsIcon} />`);
  content = content.replace(/<Text style=\{styles\.recentIcon\}>🕐<\/Text>/g, `<Ionicons name="time-outline" size={20} color={colors.textLight} style={styles.recentIcon} />`);
  content = content.replace(/<Text style=\{styles\.insightsIcon\}>💡<\/Text>/g, `<Ionicons name="bulb" size={20} color={colors.primary} style={styles.insightsIcon} />`);

  // Update width in styles.statCard
  content = content.replace(/width: \(width - 48\) \/ 2,/g, `/* width dynamically set */`);

  // StatCard Animated.View dynamic width
  content = content.replace(
    /<Animated\.View\s*style=\{\[\s*styles\.statCard,\s*\{\s*opacity: fadeAnim,\s*transform: \[\{\s*translateY: slideAnim\s*\}\]\s*\},\s*\]\}/g,
    `<Animated.View
      style={[
        styles.statCard,
        { width: (width - 48) / 2 },
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}`
  );

  // Replace fonts
  content = content.replace(/fontFamily:\s*"Poppins_500Medium"/g, `...typography.body`);
  content = content.replace(/fontFamily:\s*"Poppins_600SemiBold"/g, `...typography.subtitle`);
  content = content.replace(/fontFamily:\s*"Poppins_700Bold"/g, `...typography.h3`);
  content = content.replace(/fontFamily:\s*"Poppins_800ExtraBold"/g, `...typography.h1`);
  content = content.replace(/fontSize:\s*\d+,?\s*\n\s*\.\.\.typography/g, `...typography`);

  // Replace colors
  content = content.replace(/backgroundColor:\s*"#f0f2f5"/g, `backgroundColor: colors.background`);
  content = content.replace(/backgroundColor:\s*"#fff"/g, `backgroundColor: colors.card`);
  content = content.replace(/color:\s*"#8e8e93"/g, `color: colors.textLight`);
  content = content.replace(/color:\s*"#1a1a2e"/g, `color: colors.text`);
  content = content.replace(/color:\s*"#aaa"/g, `color: colors.textLight`);

  fs.writeFileSync(file, content, 'utf-8');
  console.log('DashboardScreen updated.');
}

function refactorAddProduct() {
  const file = 'c:/Users/Vaibhav Sharma/Desktop/vaibhav projects/SE-mobile/shopease-mobile/screens/admin/AddProductScreen.js';
  let content = fs.readFileSync(file, 'utf-8');

  if (!content.includes('SafeAreaView')) {
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+"react-native";/,
      `import {$1} from "react-native";\nimport { SafeAreaView } from "react-native-safe-area-context";\nimport { Ionicons } from "@expo/vector-icons";\nimport { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";`
    );
  }

  content = content.replace(/const \{ width \} = Dimensions\.get\("window"\);\n/, '');
  
  content = content.replace(
    /export default function AddProductScreen\(\) \{/,
    `export default function AddProductScreen() {\n  const { width } = useWindowDimensions();`
  );

  // Replace imports useWindowDimensions
  if (!content.includes('useWindowDimensions')) {
     content = content.replace(/Dimensions,/, 'useWindowDimensions,');
  }

  // Root View to SafeAreaView
  content = content.replace(
    /<View style=\{styles\.container\}>/,
    `<SafeAreaView style={styles.container}>`
  );
  content = content.replace(
    /<\/ScrollView>\s*<\/View>/,
    `</ScrollView>\n    </SafeAreaView>`
  );

  // Form validation field level borders: add a class conditionally
  // E.g. <TextInput style={[styles.input, submitting && !name.trim() && {borderColor: 'red'}]} ...
  content = content.replace(
    /style=\{styles\.input\}\n\s*value=\{name\}/g,
    `style={[styles.input, submitting && !name.trim() && { borderColor: 'red' }]}\n              value={name}`
  );
  content = content.replace(
    /style=\{styles\.input\}\n\s*value=\{price\}/g,
    `style={[styles.input, submitting && !price && { borderColor: 'red' }]}\n              value={price}`
  );
  content = content.replace(
    /style=\{styles\.input\}\n\s*value=\{stock\}/g,
    `style={[styles.input, submitting && !stock && { borderColor: 'red' }]}\n              value={stock}`
  );
  content = content.replace(
    /style=\{\[styles\.input, styles\.textArea\]\}\n(.*?)value=\{description\}/gs,
    `style={[styles.input, styles.textArea, submitting && !description.trim() && { borderColor: 'red' }]}\n$1value={description}`
  );
  content = content.replace(
    /style=\{\[styles\.input, \{ flex: 1, marginBottom: 0 \}\]\}\n\s*value=\{image\}/g,
    `style={[styles.input, { flex: 1, marginBottom: 0 }, submitting && !image.trim() && { borderColor: 'red' }]}\n              value={image}`
  );

  // Image preview border validation
  content = content.replace(
    /style=\{styles\.imagePlaceholder\}/g,
    `style={[styles.imagePlaceholder, submitting && !image && { borderColor: 'red' }]}`
  );


  // Replace fonts
  content = content.replace(/fontFamily:\s*"Poppins_500Medium"/g, `...typography.body`);
  content = content.replace(/fontFamily:\s*"Poppins_600SemiBold"/g, `...typography.subtitle`);
  content = content.replace(/fontFamily:\s*"Poppins_700Bold"/g, `...typography.h3`);
  content = content.replace(/fontFamily:\s*"Poppins_800ExtraBold"/g, `...typography.h1`);
  content = content.replace(/fontSize:\s*\d+,?\s*\n\s*\.\.\.typography/g, `...typography`);

  // Replace colors
  content = content.replace(/backgroundColor:\s*"#f0f2f5"/g, `backgroundColor: colors.background`);
  content = content.replace(/backgroundColor:\s*"#fff"/g, `backgroundColor: colors.card`);

  fs.writeFileSync(file, content, 'utf-8');
  console.log('AddProductScreen updated.');
}

function refactorProducts() {
  const file = 'c:/Users/Vaibhav Sharma/Desktop/vaibhav projects/SE-mobile/shopease-mobile/screens/admin/ProductsScreen.js';
  let content = fs.readFileSync(file, 'utf-8');

  if (!content.includes('SafeAreaView')) {
    content = content.replace(
      /import\s+\{([^}]+)\}\s+from\s+"react-native";/,
      `import {$1, ActivityIndicator} from "react-native";\nimport { SafeAreaView } from "react-native-safe-area-context";\nimport { Ionicons } from "@expo/vector-icons";\nimport { colors, fonts, typography, spacing, radius, shadows } from "../../src/theme";`
    );
  }

  // Root View to SafeAreaView
  content = content.replace(
    /<View style=\{styles\.container\}>/,
    `<SafeAreaView style={styles.container}>`
  );
  content = content.replace(
    /<\/FlatList>\s*<\/View>/,
    `</FlatList>\n    </SafeAreaView>`
  );

  // Loading state
  if (!content.includes('loading')) {
    content = content.replace(
      /const \[search, setSearch\] = useState\(""\);/,
      `const [search, setSearch] = useState("");\n  const [loading, setLoading] = useState(true);`
    );
    content = content.replace(
      /setProducts\(response\.data\);\n\s*\} catch \(error\) \{/g,
      `setProducts(response.data);\n    } catch (error) {\n`
    );
    content = content.replace(
      /\} catch \(error\) \{\n\s*console\.log\(error\);\n\s*\}/g,
      `} catch (error) {\n      console.log(error);\n    } finally {\n      setLoading(false);\n    }`
    );
  }

  // Empty state
  if (!content.includes('ListEmptyComponent')) {
    content = content.replace(
      /renderItem=\{/g,
      `ListEmptyComponent={!loading && <View style={{padding: 20, alignItems: 'center'}}><Text style={{...typography.body, color: colors.textLight}}>No products found.</Text></View>}\n        renderItem={`
    );
  }
  
  // Loading indicator rendering
  if (!content.includes('<ActivityIndicator')) {
    content = content.replace(
      /<FlatList/,
      `{loading ? (\n        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />\n      ) : (\n      <FlatList`
    );
    content = content.replace(
      /<\/FlatList>/,
      `</FlatList>\n      )}`
    );
  }

  // Delete confirmation
  content = content.replace(
    /onPress=\{\(\) => deleteProduct\(item\._id\)\}/g,
    `onPress={() => {\n                Alert.alert("Confirm Delete", "Are you sure you want to delete this product?", [\n                  { text: "Cancel", style: "cancel" },\n                  { text: "Delete", style: "destructive", onPress: () => deleteProduct(item._id) }\n                ]);\n              }}`
  );

  // Refresh control
  if (!content.includes('RefreshControl')) {
    content = content.replace(
      /import\s+\{(.*?)\}\s+from\s+"react-native";/s,
      `import {$1,\n  RefreshControl\n} from "react-native";`
    );
    content = content.replace(
      /<FlatList/,
      `<FlatList\n        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchProducts} colors={[colors.primary]} />}`
    );
  }

  // Fonts and colors
  content = content.replace(/fontFamily:\s*"Poppins_500Medium"/g, `...typography.body`);
  content = content.replace(/fontFamily:\s*"Poppins_600SemiBold"/g, `...typography.subtitle`);
  content = content.replace(/fontFamily:\s*"Poppins_700Bold"/g, `...typography.h3`);
  content = content.replace(/fontFamily:\s*"Poppins_800ExtraBold"/g, `...typography.h1`);
  content = content.replace(/backgroundColor:\s*"#f8f9fd"/g, `backgroundColor: colors.background`);
  content = content.replace(/backgroundColor:\s*"white"/g, `backgroundColor: colors.card`);

  fs.writeFileSync(file, content, 'utf-8');
  console.log('ProductsScreen updated.');
}

try {
  refactorDashboard();
  refactorAddProduct();
  refactorProducts();
  console.log("All refactors completed.");
} catch(e) {
  console.error(e);
}
