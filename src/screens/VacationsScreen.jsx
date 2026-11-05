import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";

export default function VacationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Отпуски</Text>
      <Text style={styles.subtitle}>Тук ще са заявките за отпуск</Text>
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
