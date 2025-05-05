import React, { useRef, useState } from "react";
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
import { ClassData, classList } from "../data/classList";
import ThemeToggle from "../components/ThemeToggle";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawer from "../components/Drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function GradeBuilder() {
  const { colors } = useTheme();
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedClasses, setSelectedClasses] = useState<ClassData[]>([]);
  const insets = useSafeAreaInsets();

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
    [c.code, c.name, c.period, c.mandatory].some((field) =>
      field.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const handleAdd = (item: ClassData) => {
    if (!selectedClasses.some((c) => c.code === item.code)) {
      setSelectedClasses((prev) => [...prev, item]);
    }
  };

  const renderClassItem = ({ item }: { item: ClassData }) => (
    <TouchableOpacity style={[styles.row, { borderBottomColor: colors.border }]} onPress={() => handleAdd(item)}>
      <Text style={[styles.cell, { color: colors.text }]}>{item.code}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.name}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.period}</Text>
      <Text style={[styles.cell, { color: colors.text }]}>{item.mandatory}</Text>
    </TouchableOpacity>
  );

  const handleRemove = (code: string) => {
    setSelectedClasses((prev) => prev.filter((c) => c.code !== code));
  };

  const handleSave = () => {
    // Exemplo: salvar em AsyncStorage, enviar para backend, etc.
    console.log("Grade salva:", selectedClasses);
    alert("Grade salva com sucesso!");
  };  

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburguerButton}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemeToggle />
      </View>
  
      <Text style={[styles.title, { color: colors.text }]}>
        Montar Grade de Disciplinas
      </Text>
  
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Filtrar por código, nome, período ou obrigatoriedade"
        placeholderTextColor={colors.placeholder}
        value={filter}
        onChangeText={setFilter}
      />
  
      <Text style={[styles.subtitle, { color: colors.text }]}>Disciplinas Ofertadas</Text>
      <FlatList
        data={filteredClasses}
        keyExtractor={(item) => item.code}
        renderItem={renderClassItem}
        ListEmptyComponent={
          <Text style={[styles.empty, { color: colors.text }]}>
            Nenhuma disciplina encontrada.
          </Text>
        }
        scrollEnabled={false}
      />
  
      <Text style={[styles.subtitle, { color: colors.text }]}>Minha Grade</Text>
      {selectedClasses.map((item) => (
        <View key={item.code} style={[styles.row, { borderBottomColor: colors.border }]}>
          <Text style={[styles.cell, { color: colors.text }]}>{item.code}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.name}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.period}</Text>
          <Text style={[styles.cell, { color: colors.text }]}>{item.mandatory}</Text>
          <TouchableOpacity onPress={() => handleRemove(item.code)} style={styles.removeButton}>
            <Ionicons name="trash" size={20} color={colors.danger} />
          </TouchableOpacity>
        </View>
      ))}
  
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: colors.primary, marginBottom: insets.bottom + 8 }]}
        onPress={handleSave}
      >
        <Text style={[styles.saveButtonText, { color: colors.buttonText }]}>Salvar Grade</Text>
      </TouchableOpacity>
  
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
