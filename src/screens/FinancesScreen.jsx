import { useState, useEffect } from "react";
import { StyleSheet, FlatList, View, Text, RefreshControl } from "react-native";

import { colors } from "../theme";
import { transactionApi } from "../api";

import TransactionItem from "../components/TransactionItem";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function FinancesScreen() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll();
      setTransactions(data);
      setError("");
    } catch (err) {
      setError("Неуспешно зареждане на записите. Проверете интернета.");
    }
  };

  useEffect(() => {
    loadTransactions().finally(() => setIsLoading(false));
  }, []);

  const refreshHandler = async () => {
    setIsRefreshing(true);
    await loadTransactions();
    setIsRefreshing(false);
  };

  const retryHandler = async () => {
    setIsLoading(true);
    await loadTransactions();
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && transactions.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <TransactionItem {...item} />}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshHandler}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ListHeaderComponent={
        transactions.length > 0 ? (
          <Text style={styles.subtitle}>{transactions.length} записа</Text>
        ) : null
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
