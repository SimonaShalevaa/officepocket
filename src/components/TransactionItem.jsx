import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";
import { typeLabels, formatAmount, formatDate } from "../utils/formatUtils";

export default function TransactionItem({
  title,
  type,
  category,
  amount,
  date,
  isPaid,
}) {
  const isIncome = type === "income";

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {typeLabels[type]} · {category} · {formatDate(date)}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isIncome && styles.amountIncome]}>
          {formatAmount(amount, type)}
        </Text>
        <Text style={[styles.status, !isPaid && styles.statusPending]}>
          {isPaid ? "ПЛАТЕНО" : "ЧАКАЩО"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  amountIncome: {
    color: colors.primary,
  },
  status: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 4,
  },
  statusPending: {
    color: colors.pending,
  },
});