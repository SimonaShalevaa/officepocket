import { StyleSheet, View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

import AppButton from "./AppButton";

export default function ErrorView({ message, onRetry }) {
  return (
    <View style={styles.container}>
      <Ionicons name="cloud-offline-outline" size={48} color={colors.textMuted} />
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <AppButton
          title="Опитай отново"
          variant="outline"
          onPress={onRetry}
          style={styles.button}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
    backgroundColor: colors.background,
  },
  message: {
    color: colors.text,
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    alignSelf: "stretch",
    marginTop: 8,
  },
});
