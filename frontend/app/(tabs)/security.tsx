import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Link } from "expo-router";

export default function SecurityMenu() {
  const options = [
    { title: "Live Camera View",      route: "/security/live-camera"    as const },
    { title: "Alarm Controls",        route: "/security/alarm-controls"  as const },
    { title: "Notifications & Alerts",route: "/security/notifications"   as const },
    { title: "Access History",        route: "/security/access-history"  as const },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Security Menu</Text>
      {options.map((option, index) => (
        <Link key={index} href={option.route} asChild>
          <TouchableOpacity style={styles.option}>
            <Text style={styles.optionText}>{option.title}</Text>
          </TouchableOpacity>
        </Link>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white", padding: 20, paddingTop: 60 },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 30 },
  option: { padding: 18, backgroundColor: "#f2f2f2", borderRadius: 10, marginBottom: 15 },
  optionText: { fontSize: 18 },
});