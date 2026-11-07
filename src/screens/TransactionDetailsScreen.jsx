import { StyleSheet, View, Text, ScrollView } from "react-native";

import { colors } from "../theme";
import { transactions } from "../data";
import { typeLabels, formatAmount, formatDate } from "../utils/formatUtils";

import DetailsRow from "../components/DetailsRow";

export default function TransactionDetailsScreen({ route }) {
  const { transactionId } = route.params;
  const transaction = transactions.find((item) => item.id === transactionId);

  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Записът не е намерен</Text>
      </View>
    );
  }

  const isIncome = transaction.type === "income";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Сума</Text>
        <Text style={[styles.amount, isIncome && styles.amountIncome]}>
          {formatAmount(transaction.amount, transaction.type)}
        </Text>

        <View style={[styles.badge, !transaction.isPaid && styles.badgePending]}>
          <Text
            style={[
              styles.badgeText,
              !transaction.isPaid && styles.badgeTextPending,
            ]}
          >
            {transaction.isPaid ? "ПЛАТЕНО" : "ЧАКАЩО"}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <DetailsRow label="Тип" value={typeLabels[transaction.type]} />
        <DetailsRow label="Категория" value={transaction.category} />
        <DetailsRow label="Дата" value={formatDate(transaction.date)} isLast />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    color: colors.textMuted,
    fontSize: 16,
  },
  summary: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 28,
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
  },
  amountIncome: {
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 4,
  },
  badgePending: {
    backgroundColor: colors.pendingLight,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextPending: {
    color: colors.pending,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
});