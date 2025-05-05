import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';

export default function CustomDrawer() {
  const { colors } = useTheme();
  const router = useRouter();

  // Dados genéricos temporários
  const nome = 'Guilherme Tenan Freire';
  const email = 'guitenan@edu.unirio.br';
  const matricula = '20212210018';

  const handleLogout = () => {
    // Colocar lógica de logout aqui depois
    router.replace('/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background, flex: 1 }]}>
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.mutedForeground }]}>{nome}</Text>
        <Text style={[styles.subtext, { color: colors.mutedForeground }]}>
          {email}
        </Text>
        <Text style={[styles.subtext, { color: colors.mutedForeground }]}>
          Matrícula: {matricula}
        </Text>
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
