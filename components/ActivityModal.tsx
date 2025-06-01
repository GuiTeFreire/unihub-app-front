import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ActivityModal({ visible, activity, onClose }: any) {
  const { colors } = useTheme();

  if (!activity) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>{activity.title}</Text>
          <Text style={{ color: colors.text }}>Disciplina: {activity.disciplina}</Text>
          <Text style={{ color: colors.text }}>Descrição: {activity.descricao}</Text>
          <Text style={{ color: colors.text }}>Status: {activity.status}</Text>
          <Text style={{ color: colors.text }}>Prazo: {activity.prazo}</Text>

          <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={{ color: colors.foreground }}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#00000077",
    padding: 20,
  },
  modal: {
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
  },
  button: {
    marginTop: 20,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
});
