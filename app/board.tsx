import { useEffect, useRef, useState } from "react";
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Animated, Pressable, Dimensions } from "react-native";
import ActivityColumn from "../components/ActivityColumn";
import ActivityModal from "../components/ActivityModal";
import ActivityFilter from "../components/ActivityFilter";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import CustomDrawer from "../components/Drawer";
import ThemeToggle from "../components/ThemeToggle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../services/api";
import axios from "axios";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Activity = {
  id: number;
  title: string;
  status: string;
  disciplina: string;
};

export default function Board() {
  const { colors } = useTheme();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [disciplinaFilter, setDisciplinaFilter] = useState("");
  const [draggedActivity, setDraggedActivity] = useState<Activity | null>(null);

  useEffect(() => {
    const fetchAtividades = async () => {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("usuario_id");
      if (!token || !userId) return;

      try {
        const res = await axios.get(`${API_URL}/atividades/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActivities(res.data);
      } catch (error) {
        console.error("Erro ao carregar atividades:", error);
      }
    };

    fetchAtividades();
  }, []);
  
  const statusConfig = [
    { key: "pendente", title: "Pendente", color: colors.destructive },
    { key: "emAndamento", title: "Em Progresso", color: "#f59e0b" },
    { key: "concluido", title: "Concluído", color: "#10b981" },
  ];

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

  const handleDrop = async (updatedActivity: any) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const res = await axios.put(`${API_URL}/atividades/${updatedActivity.id}`, {
        titulo: updatedActivity.titulo,
        descricao: updatedActivity.descricao,
        disciplina: updatedActivity.disciplina,
        status: updatedActivity.status,
        prazo: updatedActivity.prazo,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities((prev) =>
        prev.map((a) => (a.id === updatedActivity.id ? res.data : a))
      );

    } catch (error) {
      console.error("Erro ao atualizar atividade após drag-and-drop:", error);
    }
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

  const handleSaveActivity = async (activity: any) => {
    const token = await AsyncStorage.getItem("token");
    const userId = await AsyncStorage.getItem("usuario_id");
    if (!token || !userId) return;

    try {
      if (activity.id && activity.id !== 0) {
        // Atualizar
        const res = await axios.put(`${API_URL}/atividades/${activity.id}`, {
          titulo: activity.titulo,
          descricao: activity.descricao,
          disciplina: activity.disciplina,
          status: activity.status,
          prazo: activity.prazo,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setActivities((prev) =>
          prev.map((a) => (a.id === activity.id ? res.data : a))
        );
      } else {
        // Criar
        const res = await axios.post(`${API_URL}/atividades/usuario/${userId}`, {
          titulo: activity.titulo,
          descricao: activity.descricao,
          disciplina: activity.disciplina,
          status: activity.status,
          prazo: activity.prazo,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setActivities((prev) => [...prev, res.data]);
      }

      setSelectedActivity(null);
    } catch (error) {
      console.error("Erro ao salvar atividade:", error);
    }
  };

  const handleDeleteActivity = async (activity: any) => {
    const token = await AsyncStorage.getItem("token");
    if (!token || !activity?.id) return;

    try {
      await axios.delete(`${API_URL}/atividades/${activity.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setActivities((prev) => prev.filter((a) => a.id !== activity.id));
      setSelectedActivity(null);
    } catch (error) {
      console.error("Erro ao excluir atividade:", error);
    }
  };  

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
            selectedActivity={selectedActivity}
          />
        ))}
      </ScrollView>

      {selectedActivity && (
        <ActivityModal
          key={selectedActivity.id || "novo"}
          visible={true}
          activity={selectedActivity}
          onClose={() => {
            console.log("Fechando modal");
            setSelectedActivity(null);
          }}
          onSave={handleSaveActivity}
          onDelete={handleDeleteActivity}
        />
      )}

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() =>
          setSelectedActivity({
            id: 0,
            title: "",
            status: "pendente",
            disciplina: "",
          })
        }
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>

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
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
});