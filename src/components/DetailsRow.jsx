import { StyleSheet, View, Text } from "react-native";

import { useThemeContext } from "../contexts/theme/ThemeContext";

export default function DetailsRow({ label, value, isLast }) {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingVertical: 14,
    },
    rowDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },
    label: {
      color: colors.textMuted,
      fontSize: 15,
    },
    value: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "600",
      flexShrink: 1,
      textAlign: "right",
      marginLeft: 16,
    },
  });
}