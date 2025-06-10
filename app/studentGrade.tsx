import { useEffect, useRef, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import {
  Alert,
  Animated,
  Dimensions,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { Ionicons } from "@expo/vector-icons";
import CustomDrawer from "../components/Drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import axios from "axios";
import { API_URL } from "../services/api";

type ClassData = {
  code: string;        // Ex: "INF101"
  name: string;        // Ex: "Algoritmos e Estruturas de Dados"
  period: string;      // Ex: "1º período"
  mandatory: string;
  id?: number;
  professor?: string;
  sala?: string;
  faltas?: number;
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const TOTAL_HORAS = 60;

export default function StudentGrade() {
  const { colors } = useTheme();
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [grade, setGrade] = useState<ClassData[]>([]);

  useEffect(() => {
    const loadGrade = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("usuario_id");

        if (!token || !userId) return;

        const res = await axios.get(`${API_URL}/grades/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const extended = res.data.map((item: any) => ({
          id: item.id,
          code: item.disciplina.codigo,
          name: item.disciplina.nome,
          period: item.disciplina.periodo,
          mandatory: item.disciplina.obrigatoria,
          professor: item.professor,
          sala: item.sala,
          faltas: item.faltas,
        }));

        setGrade(extended);
      } catch (error) {
        console.error("Erro ao carregar grade:", error);
      }
    };

    loadGrade();
}, []);


  const openDrawer = () => {
    setDrawerVisible(true);
    Animated.timing(drawerAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(drawerAnim, {
      toValue: -SCREEN_WIDTH,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setDrawerVisible(false));
  };

  const updateField = (code: string, field: keyof ClassData, value: string) => {
    setGrade((prev) =>
      prev.map((item) =>
        item.code === code
          ? {
              ...item,
              [field]: field === "faltas" ? parseInt(value) || 0 : value,
            }
          : item
      )
    );
  };

  const renderRow = (item: ClassData) => {
    const faltas = item.faltas ?? 0;
    const percentual = (faltas / TOTAL_HORAS) * 100;
    const isDanger = percentual > 25;

    return (
      <View key={item.code} style={[styles.row, { borderBottomColor: colors.border }]}>
        <Text style={[styles.cell, { color: colors.text }]}>{item.code}</Text>
        <Text style={[styles.cell, { color: colors.text }]}>{item.name}</Text>
        <Text style={[styles.cell, { color: colors.text }]}>{item.period}</Text>
        <Text style={[styles.cell, { color: colors.text }]}>{item.mandatory}</Text>

        <TextInput
          placeholder="Prof."
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={item.professor ?? ""}
          onChangeText={(text) => updateField(item.code, "professor", text)}
        />
        <TextInput
          placeholder="Sala"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={item.sala ?? ""}
          onChangeText={(text) => updateField(item.code, "sala", text)}
        />
        <TextInput
          placeholder="0"
          keyboardType="numeric"
          placeholderTextColor={colors.placeholder}
          style={[styles.input, { color: colors.text, borderColor: colors.border }]}
          value={(item.faltas ?? "").toString()}
          onChangeText={(text) => updateField(item.code, "faltas", text)}
        />
        <Text style={[styles.cell, { color: isDanger ? colors.destructive : colors.text }]}>
          {percentual.toFixed(0)}%
        </Text>
      </View>
    );
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) throw new Error("Token não encontrado");

      await Promise.all(
        grade.map((item) =>
          axios.put(
            `${API_URL}/grades/${item.id}`,
            {
              disciplina_id: 0, // não precisa ser alterado
              professor: item.professor,
              sala: item.sala,
              faltas: item.faltas,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      Toast.show({
        type: "success",
        text1: "Alterações salvas com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao salvar alterações!",
        text2: "Tente novamente.",
      });
    }
  };

  const gerarTextoGrade = () => {
    return grade.map(item => {
      const faltas = item.faltas ?? 0;
      const percentual = ((faltas / TOTAL_HORAS) * 100).toFixed(0);
      return (
        `• ${item.name} (${item.code})\n` +
        `  Professor: ${item.professor ?? "N/A"}\n` +
        `  Sala: ${item.sala ?? "N/A"}\n` +
        `  Faltas: ${faltas}h (${percentual}%)\n`
      );
    }).join("\n");
  };

  const handleShare = () => {
    const message = `Minha Grade de Disciplinas:\n\n${gerarTextoGrade()}`;

    Alert.alert(
      "Compartilhar grade",
      "Como deseja compartilhar sua grade?",
      [
        {
          text: "WhatsApp",
          onPress: () => {
            const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
            Linking.openURL(url);
          },
        },
        {
          text: "E-mail",
          onPress: () => {
            const subject = "Minha Grade de Disciplinas";
            const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
            Linking.openURL(url);
          },
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburguerButton}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Minha Grade de Disciplinas</Text>

      <ScrollView horizontal>
        <View>
          <View style={[styles.row, styles.headerRow, { borderBottomColor: colors.border }]}>
            {[
              "Código",
              "Disciplina",
              "Período",
              "Obrigatória?",
              "Professor",
              "Sala",
              "Faltas(Horas)",
              "% de Faltas",
            ].map((title) => (
              <Text key={title} style={[styles.headerCell, { color: colors.text }]}>
                {title}
              </Text>
            ))}
          </View>
          {grade.map(renderRow)}
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: colors.primary }]}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>
          <Ionicons name="save" size={16} color={colors.buttonText} />{" "}
          Salvar alterações
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleShare}
        style={[styles.shareButton, { backgroundColor: colors.secondary }]}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>
          <Ionicons name="share" size={16} color={colors.buttonText} />{" "}
          Compartilhar Grade
        </Text>
      </TouchableOpacity>

      {/* Drawer overlay e container */}
      {drawerVisible && (
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable style={styles.overlay} onPress={closeDrawer} />
          <Animated.View
            style={[
              styles.drawer,
              { backgroundColor: colors.background },
              { transform: [{ translateX: drawerAnim }] },
            ]}
          >
            <CustomDrawer />
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  hamburguerButton: {
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  cell: {
    width: 120,
    paddingHorizontal: 4,
  },
  input: {
    width: 120,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  headerRow: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  headerCell: {
    width: 120,
    fontWeight: "bold",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000066",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "60%",
    padding: 24,
    zIndex: 10,
    elevation: 5,
  },
  saveButton: {
    marginTop: 24,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
  shareButton: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
});
