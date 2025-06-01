import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

export default function ActivityFilter({ disciplinaFilter, setDisciplinaFilter }: any) {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Filtrar por disciplina..."
        placeholderTextColor={colors.placeholder}
        style={[styles.input, { borderColor: colors.border, color: colors.text }]}
        value={disciplinaFilter}
        onChangeText={setDisciplinaFilter}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 8,
  },
});
