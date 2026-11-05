import { StyleSheet, View, Text } from "react-native";
import { Button } from "@react-navigation/elements";

import { colors } from "../theme";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Табло</Text>
      <Text style={styles.subtitle}>Тук ще е месечният преглед</Text>

      <Button screen="Finances" variant="filled" color={colors.primary}>
        Към финансите
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    marginBottom: 12,
  },
});
