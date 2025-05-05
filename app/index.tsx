import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import ThemeToggle from "../components/ThemeToggle";

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Entrar</Text>

      <TextInput
        placeholder="E-mail"
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor={colors.placeholder}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push("/home")}>
        <Text style={[styles.buttonText]}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={[styles.link, { color: colors.secondary }]}>
          Ainda não tem uma conta? Criar conta
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    position: "absolute",
    top: 50,
    right: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 32,
    alignSelf: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    fontSize: 14,
  },
});
