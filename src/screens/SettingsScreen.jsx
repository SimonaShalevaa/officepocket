import { StyleSheet, View, Text, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import appConfig from "../../app.json";
import { useThemeContext } from "../contexts/theme/ThemeContext";
import { selectionHaptic } from "../utils/haptics";

import TypeSelector from "../components/TypeSelector";

const themeLabels = {
  system: "Системна",
  light: "Светла",
  dark: "Тъмна",
};

export default function SettingsScreen({ navigation }) {
  const { colors, themeMode, setThemeMode } = useThemeContext();
  const styles = createStyles(colors);

  const themeChangeHandler = (mode) => {
    selectionHaptic();
    setThemeMode(mode);
  };

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.sectionTitle}>ВЪНШЕН ВИД</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Тема</Text>
        <TypeSelector
          value={themeMode}
          onChange={themeChangeHandler}
          labels={themeLabels}
        />
      </View>

      <Text style={styles.sectionTitle}>ПРОФИЛ</Text>
      <View style={styles.list}>
        <Pressable
          style={({ pressed }) => [styles.row, pressed && styles.pressed]}
          onPress={() => navigation.navigate("ChangePassword")}
        >
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.textMuted}
          />
          <Text style={styles.rowText}>Смяна на парола</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
        </Pressable>
      </View>

      <Text style={styles.version}>OfficePocket {appConfig.expo.version}</Text>
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    content: {
      flexGrow: 1,
      padding: 16,
      gap: 8,
    },
    sectionTitle: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: "bold",
      marginTop: 12,
      marginLeft: 4,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      gap: 10,
    },
    cardTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "bold",
    },
    list: {
      backgroundColor: colors.card,
      borderRadius: 16,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    pressed: {
      opacity: 0.6,
    },
    rowText: {
      flex: 1,
      color: colors.text,
      fontSize: 15,
    },
    version: {
      color: colors.textMuted,
      fontSize: 12,
      textAlign: "center",
      marginTop: "auto",
      paddingTop: 32,
    },
  });
}
