import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";
import { transactions } from "../data";
import { typeLabels, formatAmount, formatDate } from "../utils/formatUtils";

export default function TransactionDetailsScreen({ route }) {
  const { transactionId } = route.params;
  const transaction = transactions.find((item) => item.id === transactionId);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Записът не е намерен</Text>
      </View>
    );
  }

  const isIncome = transaction.type === "income";

  return (
    <View style={styles.container}>
      <Text style={[styles.amount, isIncome && styles.amountIncome]}>
        {formatAmount(transaction.amount, transaction.type)}
      </Text>
      <Text style={styles.meta}>
        {typeLabels[transaction.type]} · {transaction.category} ·{" "}
        {formatDate(transaction.date)}
      </Text>
      <Text style={[styles.status, !transaction.isPaid && styles.statusPending]}>
        {transaction.isPaid ? "ПЛАТЕНО" : "ЧАКАЩО"}
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
    gap: 8,
    paddingHorizontal: 24,
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
  },
  amountIncome: {
    color: colors.primary,
  },
  meta: {
    color: colors.textMuted,
    fontSize: 15,
  },
  status: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "bold",
  },
  statusPending: {
    color: colors.pending,
  },
  notFound: {
    color: colors.textMuted,
    fontSize: 16,
  },
});