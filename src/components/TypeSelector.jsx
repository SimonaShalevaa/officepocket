import { StyleSheet, View, Pressable, Text } from "react-native";

import { colors } from "../theme";
import { typeLabels } from "../utils/formatUtils";

export default function TypeSelector({ value, onChange }) {
  return (
    <View style={styles.container}>
      {Object.entries(typeLabels).map(([type, label]) => (
        <Pressable
          key={type}
          style={[styles.option, value === type && styles.optionActive]}
          onPress={() => onChange(type)}
        >
          <Text style={[styles.text, value === type && styles.textActive]}>
            {label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.divider,
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  optionActive: {
    backgroundColor: colors.card,
  },
  text: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  textActive: {
    color: colors.text,
    fontWeight: "bold",
  },
});