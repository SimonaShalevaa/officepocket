import { StyleSheet, FlatList, View, Text } from "react-native";

import { colors } from "../theme";
import { transactions } from "../data";

import TransactionItem from "../components/TransactionItem";

export default function FinancesScreen() {
  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem {...item} />}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <Text style={styles.subtitle}>{transactions.length} записа</Text>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Още няма записи</Text>
          <Text style={styles.emptyText}>
            Натисни „+“ горе вдясно, за да добавиш първия.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    gap: 10,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});