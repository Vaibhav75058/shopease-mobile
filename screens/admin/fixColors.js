const fs = require('fs');

function fix(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/\"#2874f0\"/g, 'colors.primary');
  
  if (file.includes('DashboardScreen')) {
      if (!content.includes('<ActivityIndicator')) {
          content = content.replace(
              /import \{\s*View,\s*Text,\s*StyleSheet,\s*ScrollView,\s*Animated,\s*useWindowDimensions,\s*TouchableOpacity,\s*RefreshControl,/,
              `import { View, Text, StyleSheet, ScrollView, Animated, useWindowDimensions, TouchableOpacity, RefreshControl, ActivityIndicator,`
          );
          content = content.replace(
              /return \(\s*<SafeAreaView style=\{styles\.container\}>/,
              `return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (`
          );
          content = content.replace(
              /<\/ScrollView>\s*<\/SafeAreaView>/,
              `</ScrollView>
      )}
    </SafeAreaView>`
          );
      }
  }

  fs.writeFileSync(file, content, 'utf-8');
}

fix('c:/Users/Vaibhav Sharma/Desktop/vaibhav projects/SE-mobile/shopease-mobile/screens/admin/DashboardScreen.js');
fix('c:/Users/Vaibhav Sharma/Desktop/vaibhav projects/SE-mobile/shopease-mobile/screens/admin/AddProductScreen.js');
