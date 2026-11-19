import { useReducer, useCallback } from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../theme";
import { listReducer, initialListState } from "../reducers/listReducer";
import { transactionApi } from "../api";
import { formatMoney } from "../utils/formatUtils";
import { successHaptic } from "../utils/haptics";

import TransactionItem from "../components/TransactionItem";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function PendingPaymentsScreen() {
  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: transactions, isLoading, isRefreshing, error } = state;

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getPending();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Неуспешно зареждане на плащанията. Проверете интернета.",
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

  const markAsPaidHandler = async (transactionId) => {
    try {
      await transactionApi.markAsPaid(transactionId);
      successHaptic();
      await loadTransactions();
    } catch (err) {
      Alert.alert("Грешка", "Плащането не беше отбелязано. Опитайте отново.");
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && transactions.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  const totalAmount = transactions.reduce((sum, item) => sum + item.amount, 0);

  return (
    <FlatList
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <TransactionItem {...item} fromPending />
          <AppButton
            title="Отбележи като платено"
            variant="outline"
            onPress={() => markAsPaidHandler(item.id)}
          />
        </View>
      )}
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
          <Text style={styles.subtitle}>
            {transactions.length}{" "}
            {transactions.length === 1 ? "запис" : "записа"} ·{" "}
            {formatMoney(totalAmount)}
          </Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Няма чакащи плащания</Text>
          <Text style={styles.emptyText}>Всички записи са платени.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    gap: 16,
  },
  item: {
    gap: 8,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
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
