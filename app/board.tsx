import { useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Animated, Pressable, Dimensions } from "react-native";
import ActivityColumn from "../components/ActivityColumn";
import ActivityModal from "../components/ActivityModal";
import ActivityFilter from "../components/ActivityFilter";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawer from "../components/Drawer";
import ThemeToggle from "../components/ThemeToggle";

const SCREEN_WIDTH = Dimensions.get("window").width;

const initialActivities = [
  { id: 1, title: "Trabalho 1", descricao: "Projeto inicial da disciplina", disciplina: "FSI", status: "pendente", prazo: "2025-05-10" },
  { id: 2, title: "Leitura Capítulo 3", descricao: "Leitura para discussão em sala", disciplina: "Engenharia de Software", status: "emAndamento", prazo: "2025-05-05" },
  { id: 3, title: "Relatório Final", descricao: "Documentação do projeto", disciplina: "APS", status: "concluido", prazo: "2025-05-12" },
  { id: 4, title: "Exercícios Lista 2", descricao: "Matemática aplicada", disciplina: "Cálculo", status: "pendente", prazo: "2025-05-15" },
  { id: 5, title: "Apresentação", descricao: "Seminário sobre IA", disciplina: "Deep Learning", status: "emAndamento", prazo: "2025-05-08" },
];

export default function Board() {
  const { colors } = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [activities, setActivities] = useState(initialActivities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [disciplinaFilter, setDisciplinaFilter] = useState("");
  const [draggedActivity, setDraggedActivity] = useState(null);

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

  const handleDrop = (updatedActivity: any) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === updatedActivity.id ? updatedActivity : a))
    );
    
    console.log(`Atividade "${updatedActivity.title}" movida para ${updatedActivity.status}`);
  };

  const handleDragStart = (activity: any) => {
    setDraggedActivity(activity);
  };

  const handleDragEnd = () => {
    setDraggedActivity(null);
  };

  const filtered = activities.filter((a) =>
    a.disciplina.toLowerCase().includes(disciplinaFilter.toLowerCase())
  );

  const getByStatus = (status: string) => filtered.filter((a) => a.status === status);

  const statusConfig = [
    { key: "pendente", title: "Pendente", color: colors.destructive },
    { key: "emAndamento", title: "Em Progresso", color: "#f59e0b" },
    { key: "concluido", title: "Concluído", color: "#10b981" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburguerButton}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Quadro de Atividades</Text>
        </View>
        
        <ThemeToggle />
      </View>

      <ActivityFilter 
        disciplinaFilter={disciplinaFilter} 
        setDisciplinaFilter={setDisciplinaFilter} 
      />

      {/* Statistics */}
      <View style={styles.stats}>
        {statusConfig.map(({ key, title, color }) => (
          <View key={key} style={styles.statItem}>
            <View style={[styles.statIndicator, { backgroundColor: color }]} />
            <Text style={[styles.statText, { color: colors.text }]}>
              {title}: {getByStatus(key).length}
            </Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal contentContainerStyle={styles.columns} showsHorizontalScrollIndicator={false}>
        {statusConfig.map(({ key, title }) => (
          <ActivityColumn
            key={key}
            title={title}
            status={key}
            activities={getByStatus(key)}
            onSelect={setSelectedActivity}
            onDrop={handleDrop}
            draggedActivity={draggedActivity}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          />
        ))}
      </ScrollView>

      <ActivityModal
        visible={!!selectedActivity}
        activity={selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      {drawerVisible && (
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable style={styles.overlay} onPress={closeDrawer} />
          <Animated.View
            style={[
              styles.drawer,
              {
                backgroundColor: colors.background,
                transform: [{ translateX: drawerAnim }],
              },
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
    padding: 16 
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  dragHint: {
    fontSize: 12,
    marginTop: 2,
  },
  hamburguerButton: {
    padding: 8,
    borderRadius: 20,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: "500",
  },
  columns: {
    paddingHorizontal: 8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
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
  },
});