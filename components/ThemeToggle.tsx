import { View, Switch, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{isDark ? "🌙" : "☀️"}</Text>
      <Switch value={isDark} onValueChange={toggleTheme} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontSize: 18 },
});
