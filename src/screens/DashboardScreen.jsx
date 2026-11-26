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

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { selectionHaptic } from "../utils/haptics";
import { listReducer, initialListState } from "../reducers/listReducer";
import { transactionApi } from "../api";
import { formatMoney, toDateString } from "../utils/formatUtils";
import {
  periodTypeLabels,
  getPeriodRange,
  getPeriodTitle,
  calculateSummary,
  calculatePending,
} from "../utils/summaryUtils";

import DetailsRow from "../components/DetailsRow";
import TypeSelector from "../components/TypeSelector";
import DateField from "../components/DateField";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function DashboardScreen({ navigation }) {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const today = new Date();

  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: transactions, isLoading, isRefreshing, error } = state;
  const [periodType, setPeriodType] = useState("month");
  const [year, setYear] = useState(today.getFullYear());
  const [period, setPeriod] = useState(today.getMonth());
  const [customStart, setCustomStart] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const [customEnd, setCustomEnd] = useState(today);

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

  const currentPeriods = {
    month: today.getMonth(),
    quarter: Math.floor(today.getMonth() / 3),
    year: 0,
  };
  const periodsInYear = { month: 12, quarter: 4 };

  const isCurrentPeriod =
    year === today.getFullYear() &&
    (periodType === "year" || period === currentPeriods[periodType]);

  const periodTypeChangeHandler = (type) => {
    selectionHaptic();
    setPeriodType(type);
    setYear(today.getFullYear());
    setPeriod(currentPeriods[type] ?? 0);
  };

  const previousPeriodHandler = () => {
    selectionHaptic();

    if (periodType === "year" || period === 0) {
      setYear(year - 1);
    }

    if (periodType !== "year") {
      setPeriod(period === 0 ? periodsInYear[periodType] - 1 : period - 1);
    }
  };

  const nextPeriodHandler = () => {
    if (isCurrentPeriod) {
      return;
    }

    selectionHaptic();

    const lastPeriod = periodsInYear[periodType] - 1;

    if (periodType === "year" || period === lastPeriod) {
      setYear(year + 1);
    }

    if (periodType !== "year") {
      setPeriod(period === lastPeriod ? 0 : period + 1);
    }
  };

  const customStartChangeHandler = (date) => {
    setCustomStart(date);

    if (date > customEnd) {
      setCustomEnd(date);
    }
  };

  const customEndChangeHandler = (date) => {
    setCustomEnd(date);

    if (date < customStart) {
      setCustomStart(date);
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && transactions.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  const range =
    periodType === "custom"
      ? {
          startDate: toDateString(customStart),
          endDate: toDateString(customEnd),
        }
      : getPeriodRange(periodType, year, period);

  const summary = calculateSummary(
    transactions,
    range.startDate,
    range.endDate,
  );
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
      <TypeSelector
        value={periodType}
        onChange={periodTypeChangeHandler}
        labels={periodTypeLabels}
      />

      {periodType === "custom" ? (
        <View style={styles.row}>
          <View style={styles.dateColumn}>
            <DateField
              label="От"
              value={customStart}
              onChange={customStartChangeHandler}
            />
          </View>
          <View style={styles.dateColumn}>
            <DateField
              label="До"
              value={customEnd}
              onChange={customEndChangeHandler}
            />
          </View>
        </View>
      ) : (
        <View style={styles.monthBox}>
          <Pressable
            style={({ pressed }) => [
              styles.arrow,
              pressed && styles.arrowPressed,
            ]}
            onPress={previousPeriodHandler}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={20} color={colors.primary} />
          </Pressable>

          <Text style={styles.monthText}>
            {getPeriodTitle(periodType, year, period)}
          </Text>

          <Pressable
            style={({ pressed }) => [
              styles.arrow,
              isCurrentPeriod && styles.arrowDisabled,
              pressed && !isCurrentPeriod && styles.arrowPressed,
            ]}
            onPress={nextPeriodHandler}
            disabled={isCurrentPeriod}
            hitSlop={8}
          >
            <Ionicons
              name="chevron-forward"
              size={20}
              color={isCurrentPeriod ? colors.border : colors.primary}
            />
          </Pressable>
        </View>
      )}

      <View style={styles.balanceCard}>
        <Text style={styles.cardLabel}>Баланс за периода</Text>
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

      <Button screen="Finances" variant="filled" color={colors.primaryButton}>
        Към финансите
      </Button>
    </ScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    content: {
      padding: 16,
      gap: 12,
    },
    dateColumn: {
      flex: 1,
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
      borderRadius: 16,
      paddingVertical: 12,
      alignItems: "center",
      gap: 2,
    },
    cardLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "600",
    },
    balance: {
      fontSize: 26,
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
}
