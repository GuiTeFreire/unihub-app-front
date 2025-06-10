import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../services/api";
import axios from "axios";
import { Calendar } from "react-native-calendars";

export default function ActivityModal({ visible, activity, onClose, onSave, onDelete }: any) {
  const { colors } = useTheme();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [disciplina, setDisciplina] = useState("");
  const [prazo, setPrazo] = useState("");
  const [status, setStatus] = useState("pendente");
  const [disciplinas, setDisciplinas] = useState<string[]>([]);
  const [disciplinaModalVisible, setDisciplinaModalVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    if (visible && activity) {
      setTitulo(activity.titulo ?? "");
      setDescricao(activity.descricao ?? "");
      setDisciplina(activity.disciplina ?? "");
      setPrazo(activity.prazo ?? "");
      setStatus(activity.status ?? "pendente");
    }
  }, [visible, activity]);

  useEffect(() => {
    const fetchGrade = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("usuario_id");

        if (!token || !userId) return;

        const res = await axios.get(`${API_URL}/grades/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const nomes = res.data.map((item: any) => item.disciplina.nome);
        setDisciplinas(nomes);
      } catch (err) {
        console.error("Erro ao carregar disciplinas:", err);
      }
    };

    fetchGrade();
  }, []);

  const handleSave = () => {
    if (!titulo || !disciplina || !prazo) return;

    const updated = {
      ...activity,
      titulo,
      descricao,
      disciplina,
      prazo,
      status,
    };
    onSave(updated);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            {activity?.id ? "Editar Atividade" : "Nova Atividade"}
          </Text>

          <TextInput
            placeholder="Título"
            value={titulo}
            onChangeText={setTitulo}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholderTextColor={colors.placeholder}
          />

          <TextInput
            placeholder="Descrição (opcional)"
            value={descricao}
            onChangeText={setDescricao}
            style={[styles.input, { borderColor: colors.border, color: colors.text }]}
            placeholderTextColor={colors.placeholder}
          />

          <View style={[styles.input, { borderColor: colors.border }]}>
            <TouchableOpacity
              onPress={() => setDisciplinaModalVisible(true)}
              style={[styles.input, { justifyContent: "center", borderColor: colors.border }]}
            >
              <Text style={{ color: disciplina ? colors.text : colors.placeholder }}>
                {disciplina || "Selecionar disciplina"}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setCalendarVisible(true)}
            style={[styles.input, { justifyContent: "center", borderColor: colors.border }]}
          >
            <Text style={{ color: prazo ? colors.text : colors.placeholder }}>
              {prazo || "Selecionar data"}
            </Text>
          </TouchableOpacity>

          <Modal visible={disciplinaModalVisible} transparent animationType="fade">
            <Pressable style={styles.overlay} onPress={() => setDisciplinaModalVisible(false)}>
              <View style={[styles.dropdownModal, { backgroundColor: colors.card }]}>
                {disciplinas.map((d) => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => {
                      setDisciplina(d);
                      setDisciplinaModalVisible(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={{ color: colors.text }}>{d}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Pressable>
          </Modal>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: colors.primary }]}>
              <Text style={{ color: colors.buttonText }}>Salvar</Text>
            </TouchableOpacity>

            {!!activity?.id && (
              <TouchableOpacity onPress={() => onDelete(activity)} style={[styles.button, { backgroundColor: colors.destructive }]}>
                <Text style={{ color: colors.destructiveForeground }}>Excluir</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={onClose} style={[styles.button, { backgroundColor: colors.mutedForeground }]}>
              <Text style={{ color: colors.foreground }}>Cancelar</Text>
            </TouchableOpacity>
          </View>
          
          {calendarVisible && (
            <View style={StyleSheet.absoluteFillObject}>
              <Pressable style={styles.overlay} onPress={() => setCalendarVisible(false)} />
              <View style={[styles.calendarModal, { backgroundColor: colors.card }]}>
                <Calendar
                  onDayPress={(day) => {
                    setPrazo(day.dateString);
                    setCalendarVisible(false);
                  }}
                  markedDates={{
                    [prazo]: { selected: true, selectedColor: colors.primary },
                  }}
                  theme={{
                    calendarBackground: colors.card,
                    dayTextColor: colors.text,
                    monthTextColor: colors.text,
                    todayTextColor: colors.secondary,
                  }}
                />
              </View>
            </View>
          )}
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
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
    dropdownModal: {
    margin: 32,
    borderRadius: 12,
    padding: 12,
    maxHeight: 300,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  calendarModal: {
    position: "absolute",
    top: "30%",
    left: "10%",
    right: "10%",
    padding: 20,
    borderRadius: 16,
    elevation: 10,
    alignItems: "center",
    maxHeight: 400,
    zIndex: 20,
  },
});
