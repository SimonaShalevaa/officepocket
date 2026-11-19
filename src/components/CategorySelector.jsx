import { StyleSheet, View, Pressable, Text } from "react-native";

import { colors } from "../theme";

export default function CategorySelector({ options, value, onChange }) {
  const pressHandler = (option) => {
    onChange(option === value ? "" : option);
  };

  return (
    <View style={styles.container}>
      {options.map((option) => (
        <Pressable
          key={option}
          style={[styles.chip, value === option && styles.chipActive]}
          onPress={() => pressHandler(option)}
        >
          <Text style={[styles.text, value === option && styles.textActive]}>
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  text: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
  },
  textActive: {
    color: colors.primary,
  },
});
