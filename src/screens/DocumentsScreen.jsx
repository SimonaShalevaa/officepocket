import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";

export default function DocumentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Документи</Text>
      <Text style={styles.subtitle}>
        Тук ще са фактурите, бележките и договорите
      </Text>
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
    textAlign: "center",
  },
});
