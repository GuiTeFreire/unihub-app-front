import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import ThemeToggle from "../components/ThemeToggle";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login/`, {
        username: email,
        password: senha,
      }, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: [(data) => {
          const params = new URLSearchParams();
          for (let key in data) params.append(key, data[key]);
          return params.toString();
        }],
      });

      const token = response.data.access_token;
      const userId = response.data.usuario_id;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("usuario_id", userId.toString());

      Toast.show({
        type: "success",
        text1: "Login realizado com sucesso!"
      });

      router.push("/home");

    } catch (error: any) {
      console.error("Erro no login:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao fazer login",
        text2: error?.response?.data?.detail || "Verifique suas credenciais"
      });
    }
  };

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
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor={colors.placeholder}
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={handleLogin}>
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
