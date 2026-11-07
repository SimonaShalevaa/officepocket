import { StyleSheet, ScrollView, Text } from "react-native";

import { colors } from "../theme";
import { transactions } from "../data";

import TransactionItem from "../components/TransactionItem";

export default function FinancesScreen() {
  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.subtitle}>{transactions.length} записа</Text>

      {transactions.map((transaction) => (
        <TransactionItem key={transaction.id} {...transaction} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 10,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
});