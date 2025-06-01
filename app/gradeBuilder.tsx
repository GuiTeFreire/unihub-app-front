import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Pressable,
  Dimensions,
  ScrollView,
} from "react-native";
import ThemeToggle from "../components/ThemeToggle";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawer from "../components/Drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import axios from "axios";
import { API_URL } from "../services/api";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SCREEN_WIDTH = Dimensions.get("window").width;

type ClassData = {
  id: number;
  nome: string;
  codigo: string;
  obrigatoria: string;
  periodo: string;
};

export default function GradeBuilder() {
  const { colors } = useTheme();
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filter, setFilter] = useState("");
  const [classList, setClassList] = useState<ClassData[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<ClassData[]>([]);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchDisciplinas = async () => {
      try {
        const response = await axios.get(`${API_URL}/disciplinas`);
        setClassList(response.data); // Supondo retorno em array
      } catch (error) {
        console.error("Erro ao buscar disciplinas:", error);
      }
    };
    fetchDisciplinas();
  }, []);

  useEffect(() => {
    const fetchMinhaGrade = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userId = await AsyncStorage.getItem("usuario_id");

        if (!token || !userId) return;

        const res = await axios.get(`${API_URL}/grades/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const disciplinasSalvas = res.data.map((item: any) => item.disciplina);
        setSelectedClasses(disciplinasSalvas);
      } catch (error) {
        console.error("Erro ao buscar grade salva:", error);
      }
    };

    fetchMinhaGrade();
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
const filteredClasses = classList.filter((c) =>
    [c.codigo, c.nome, c.periodo, c.obrigatoria].some((field) =>
      field.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const handleAdd = (item: ClassData) => {
    if (!selectedClasses.some((c) => c.codigo === item.codigo)) {
      setSelectedClasses((prev) => [...prev, item]);
    }
  };

  const handleRemove = (codigo: string) => {
    setSelectedClasses((prev) => prev.filter((c) => c.codigo !== codigo));
  };

  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("usuario_id");

      if (!token || !userId) throw new Error("Usuário não autenticado");

      for (const disciplina of selectedClasses) {
        await axios.post(
          `${API_URL}/grades/usuario/${userId}`,
          {
            disciplina_id: disciplina.id,
            professor: "",
            sala: "",
            faltas: 0,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      Toast.show({
        type: "success",
        text1: "Grade salva com sucesso!",
      });
    } catch (error: any) {
      console.error("Erro ao salvar grade:", error);
      Toast.show({
        type: "error",
        text1: "Erro ao salvar grade",
        text2: error.message,
      });
    }
  };

  const renderClassItem = ({ item }: { item: ClassData }) => (
    <TouchableOpacity onPress={() => handleAdd(item)} style={[styles.row, { borderBottomColor: colors.border }]}>
      <Text style={[styles.cell, { color: colors.text }]}>{item.codigo}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.nome}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.periodo}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.obrigatoria}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburguerButton}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Montar Grade de Disciplinas</Text>

      <TextInput
        placeholder="Filtrar por código, nome, período ou obrigatoriedade"
        placeholderTextColor={colors.placeholder}
        value={filter}
        onChangeText={setFilter}
        style={[styles.input, {
          backgroundColor: colors.card,
          color: colors.text,
          borderColor: colors.border,
        }]}
      />

      <Text style={[styles.subtitle, { color: colors.text }]}>Disciplinas Ofertadas</Text>
      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.codigo}
        renderItem={renderClassItem}
        ListEmptyComponent={<Text style={[styles.empty, { color: colors.text }]}>Nenhuma disciplina encontrada.</Text>}
        scrollEnabled={false}
      />

      <Text style={[styles.subtitle, { color: colors.text }]}>Minha Grade</Text>
      {selectedClasses.map((item) => (
        <View key={item.codigo} style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.cell, { color: colors.text }]}>{item.codigo}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.nome}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.periodo}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.obrigatoria}</Text>
          <TouchableOpacity onPress={() => handleRemove(item.codigo)} style={styles.removeButton}>
            <Ionicons name="trash" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        onPress={handleSave}
        style={[styles.saveButton, { backgroundColor: colors.primary, marginBottom: insets.bottom + 8 }]}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>Salvar Grade</Text>
      </TouchableOpacity>

      {drawerVisible && (
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable style={styles.overlay} onPress={closeDrawer} />
          <Animated.View style={[styles.drawer, { backgroundColor: colors.background, transform: [{ translateX: drawerAnim }] }]}>
            <CustomDrawer />
          </Animated.View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingVertical: 8,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  empty: {
    textAlign: "center",
    padding: 20,
    fontStyle: "italic",
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
  removeButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  saveButton: {
    marginTop: 24,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    paddingBottom: 16,
  },
  
  saveButtonText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
