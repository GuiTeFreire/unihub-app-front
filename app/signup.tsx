import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useRouter } from "expo-router";
import ThemeToggle from "../components/ThemeToggle";
import Toast from "react-native-toast-message";
import axios from "axios";
import { useState } from "react";
import { API_URL } from "../services/api";

export default function SignupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${API_URL}/usuarios`, {
        nome, email, senha, matricula
      });

      Toast.show({
        type: "success",
        text1: "Cadastro realizado com sucesso!",
      });

      router.replace("/");
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: error?.response?.data?.detail || "Tente novamente",
      });
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>

      <TextInput
        placeholder="Nome completo"
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={nome} onChangeText={setNome}
      />

      <TextInput
        placeholder="Matrícula"
        placeholderTextColor={colors.placeholder}
        keyboardType="numeric"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={matricula} onChangeText={setMatricula}
      />

      <TextInput
        placeholder="E-mail"
        placeholderTextColor={colors.placeholder}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={email} onChangeText={setEmail}
      />

      <TextInput
        placeholder="Senha"
        secureTextEntry
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }]}
        value={senha} onChangeText={setSenha}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]}  onPress={handleSignup}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/")}>
        <Text style={[styles.link, { color: colors.secondary }]}>
          Já tem uma conta? Entrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  header: { position: "absolute", top: 50, right: 20 },
  title: { fontSize: 28, fontWeight: "600", marginBottom: 32, alignSelf: "center" },
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
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { textAlign: "center", fontSize: 14 },
});
