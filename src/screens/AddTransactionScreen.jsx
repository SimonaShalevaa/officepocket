import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";

export default function AddTransactionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Нов запис</Text>
      <Text style={styles.subtitle}>Тук ще е формата за нов приход или разход</Text>
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