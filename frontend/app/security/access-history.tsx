import { View, Text, StyleSheet } from "react-native";

export default function AccessHistory() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Access History Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" },
  text: { fontSize: 20, fontWeight: "500" },
});