import { useState, useReducer, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Pressable,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Button } from "@react-navigation/elements";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";
import { selectionHaptic } from "../utils/haptics";
import { listReducer, initialListState } from "../reducers/listReducer";
import { transactionApi } from "../api";
import { formatMoney } from "../utils/formatUtils";
import {
  monthNames,
  calculateMonthSummary,
  calculatePending,
} from "../utils/summaryUtils";

import DetailsRow from "../components/DetailsRow";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function DashboardScreen({ navigation }) {
  const today = new Date();

  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: transactions, isLoading, isRefreshing, error } = state;
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const loadTransactions = async () => {
    try {
      const data = await transactionApi.getAll();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Неуспешно зареждане на данните. Проверете интернета.",
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

  const isCurrentMonth =
    year === today.getFullYear() && month === today.getMonth();

  const previousMonthHandler = () => {
    selectionHaptic();

    if (month === 0) {
      setMonth(11);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonthHandler = () => {
    if (isCurrentMonth) {
      return;
    }

    selectionHaptic();

    if (month === 11) {
      setMonth(0);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && transactions.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  const summary = calculateMonthSummary(transactions, year, month);
  const pending = calculatePending(transactions);
  const isPositive = summary.balance >= 0;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshHandler}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
    >
      <View style={styles.monthBox}>
        <Pressable
          style={({ pressed }) => [
            styles.arrow,
            pressed && styles.arrowPressed,
          ]}
          onPress={previousMonthHandler}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.primary} />
        </Pressable>

        <Text style={styles.monthText}>
          {monthNames[month]} {year}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.arrow,
            isCurrentMonth && styles.arrowDisabled,
            pressed && !isCurrentMonth && styles.arrowPressed,
          ]}
          onPress={nextMonthHandler}
          disabled={isCurrentMonth}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-forward"
            size={20}
            color={isCurrentMonth ? colors.border : colors.primary}
          />
        </Pressable>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Баланс за месеца</Text>
        <Text
          style={[
            styles.balance,
            isPositive ? styles.positive : styles.negative,
          ]}
        >
          {isPositive ? "+" : "−"}
          {formatMoney(Math.abs(summary.balance))}
        </Text>
      </View>

      <View style={styles.row}>
        <View style={styles.smallCard}>
          <View style={styles.smallLabelRow}>
            <Ionicons name="arrow-down" size={14} color={colors.primary} />
            <Text style={styles.cardLabel}>Приходи</Text>
          </View>
          <Text style={[styles.smallValue, styles.positive]}>
            {formatMoney(summary.income)}
          </Text>
        </View>

        <View style={styles.smallCard}>
          <View style={styles.smallLabelRow}>
            <Ionicons name="arrow-up" size={14} color={colors.error} />
            <Text style={styles.cardLabel}>Разходи</Text>
          </View>
          <Text style={styles.smallValue}>
            {formatMoney(summary.totalExpenses)}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <DetailsRow label="Разходи" value={formatMoney(summary.expense)} />
        <DetailsRow label="Заплати" value={formatMoney(summary.salary)} />
        <DetailsRow
          label="Дивиденти"
          value={formatMoney(summary.dividend)}
          isLast
        />
      </View>

      {pending.count > 0 && (
        <Pressable
          style={({ pressed }) => [
            styles.pendingCard,
            pressed && styles.pendingCardPressed,
          ]}
          onPress={() => navigation.navigate("PendingPayments")}
        >
          <Ionicons name="time-outline" size={24} color={colors.pending} />
          <View style={styles.pendingInfo}>
            <Text style={styles.pendingTitle}>Чакащи плащания</Text>
            <Text style={styles.pendingText}>
              {pending.count} {pending.count === 1 ? "запис" : "записа"} ·{" "}
              {formatMoney(pending.amount)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.pending} />
        </Pressable>
      )}

      <Button screen="Finances" variant="filled" color={colors.primary}>
        Към финансите
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 12,
  },
  monthBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 8,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  arrowPressed: {
    opacity: 0.6,
  },
  arrowDisabled: {
    backgroundColor: colors.divider,
  },
  monthText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
  balanceCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingVertical: 22,
    alignItems: "center",
    gap: 6,
  },
  cardLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  balance: {
    fontSize: 32,
    fontWeight: "bold",
  },
  positive: {
    color: colors.primary,
  },
  negative: {
    color: colors.error,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  smallCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 14,
    gap: 6,
  },
  smallLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  smallValue: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  pendingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.pendingLight,
    borderRadius: 16,
    padding: 14,
  },
  pendingCardPressed: {
    opacity: 0.7,
  },
  pendingInfo: {
    flex: 1,
  },
  pendingTitle: {
    color: colors.pending,
    fontSize: 15,
    fontWeight: "bold",
  },
  pendingText: {
    color: colors.pending,
    fontSize: 13,
    marginTop: 2,
  },
});
