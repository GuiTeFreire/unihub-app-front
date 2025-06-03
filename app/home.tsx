import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "../contexts/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";
import CustomDrawer from "../components/Drawer";
import { Calendar } from "react-native-calendars";

const SCREEN_WIDTH = Dimensions.get("window").width;

type Task = { title: string };
type TaskMap = Record<string, Task[]>;

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const drawerAnim = useRef(new Animated.Value(-SCREEN_WIDTH)).current;
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [tasks, setTasks] = useState<TaskMap>({
    "2025-05-10": [{ title: "Entregar trabalho de FSI" }],
    "2025-05-15": [{ title: "Prova de Cálculo" }, { title: "Reunião de grupo" }],
  });  

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


  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={openDrawer} style={styles.hamburguerButton}>
          <Ionicons name="menu" size={24} color={colors.text} />
        </TouchableOpacity>
        <ThemeToggle />
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Bem-vind@ ao BsiHub!</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/gradeBuilder")}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            <Ionicons name="clipboard" size={16} color={colors.buttonText} />{" "}
            Montar grade horária
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/studentGrade")}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            <Ionicons name="book" size={16} color={colors.buttonText} />{" "}
            Gerenciar disciplinas
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/board")}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            <Ionicons name="checkmark-circle" size={16} color={colors.buttonText} />{" "}
            Quadro de atividades
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setCalendarVisible(!calendarVisible)}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            <Ionicons name="calendar" size={16} color={colors.buttonText} /> Calendário
          </Text>
        </TouchableOpacity>
      </View>

      {calendarVisible && (
        <View style={StyleSheet.absoluteFillObject}>
          <Pressable style={styles.overlay} onPress={() => setCalendarVisible(false)} />
          <View style={[styles.calendarModal, { backgroundColor: colors.card }]}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setCalendarVisible(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>

            <Calendar
              style={{ width: "100%" , alignSelf: "stretch" }}
              onDayPress={handleDayPress}
              markedDates={{
                [selectedDate]: {
                  selected: true,
                  selectedColor: colors.primary,
                },
                ...Object.keys(tasks).reduce<Record<string, any>>((acc, date) => {
                  acc[date] = {
                    marked: true,
                    dotColor: colors.secondary,
                  };
                  return acc;
                }, {}),
              }}
              theme={{
                calendarBackground: colors.card,
                dayTextColor: colors.text,
                monthTextColor: colors.text,
                todayTextColor: colors.secondary,
              }}
            />

            {selectedDate && tasks[selectedDate] && (
              <View style={{ marginTop: 12 }}>
                <Text style={{ color: colors.text, fontWeight: "bold", marginBottom: 4 }}>
                  Atividades em {selectedDate}:
                </Text>
                {tasks[selectedDate].map((task, index) => (
                  <Text key={index} style={{ color: colors.primary }}>
                    • {task.title}
                  </Text>
                ))}
              </View>
            )}
          </View>
        </View>
      )}

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
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
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
  calendarModal: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    bottom: 50,
    backgroundColor: "#ffffffee",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingTop: 50,
    justifyContent: "flex-start",
    elevation: 10,
  },
  
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff4444",
    borderRadius: 20,
    padding: 0.05,
    zIndex: 10,
  },
});
