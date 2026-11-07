import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";

export default function DetailsRow({ label, value, isLast }) {
  return (
    <View style={[styles.row, !isLast && styles.rowDivider]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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