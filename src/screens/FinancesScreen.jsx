import { useReducer, useCallback } from "react";
import { StyleSheet, FlatList, View, Text, RefreshControl } from "react-native";

import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../theme";
import { listReducer, initialListState } from "../reducers/listReducer";
import { transactionApi } from "../api";

import TransactionItem from "../components/TransactionItem";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function FinancesScreen() {
  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: transactions, isLoading, isRefreshing, error } = state;

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Неуспешно зареждане на записите. Проверете интернета.",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, []),
  );

  const refreshHandler = async () => {
    dispatch({ type: "REFRESH_START" });
    await loadTransactions();
  };

  const retryHandler = async () => {
    dispatch({ type: "FETCH_START" });
    await loadTransactions();
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
