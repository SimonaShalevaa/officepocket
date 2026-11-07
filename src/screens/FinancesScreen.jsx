import { StyleSheet, ScrollView, Text } from "react-native";
import { Button } from "@react-navigation/elements";

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

      <Button
        screen="TransactionDetails"
        variant="filled"
        color={colors.primary}
        style={styles.button}
      >
        Към детайли
      </Button>
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
  button: {
    marginTop: 12,
  },
});