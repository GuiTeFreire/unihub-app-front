import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function CustomDrawer() {
  const { colors } = useTheme();
  const router = useRouter();

  // Dados genéricos temporários
  const nome = 'Guilherme Tenan Freire';
  const email = 'guitenan@edu.unirio.br';
  const matricula = '20212210018';

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("usuario_id");

      Toast.show({
        type: "success",
        text1: "Logout realizado com sucesso!",
      });

      router.replace("/"); // volta para login
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao sair",
        text2: "Tente novamente",
      });
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, flex: 1 }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.primary }]}>{nome}</Text>
        <Text style={[styles.subtext, { color: colors.primary }]}>
          {email}
        </Text>
        <Text style={[styles.subtext, { color: colors.primary }]}>
          Matrícula: {matricula}
        </Text>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.primary }]} onPress={() => router.push("/home")}>
          <Text style={[styles.buttonText]}>Início</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { backgroundColor: colors.destructive }]}
        onPress={handleLogout}
      >
        <Text style={[styles.logoutText, { color: colors.destructiveForeground }]}>
          Sair
        </Text>
      </TouchableOpacity>
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    justifyContent: 'space-between',
  },
  header: {
    marginTop: 40,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtext: {
    marginTop: 8,
    fontSize: 16,
  },
  button: {
    padding: 6,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
