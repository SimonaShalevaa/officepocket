import { useReducer, useCallback } from "react";
import { StyleSheet, FlatList, View, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { listReducer, initialListState } from "../reducers/listReducer";
import { vacationApi } from "../api";
import {
  DEFAULT_VACATION_DAYS,
  calculatePaidDaysInYear,
} from "../utils/vacationUtils";

import VacationItem from "../components/VacationItem";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function VacationsScreen() {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: vacations, isLoading, isRefreshing, error } = state;

  const loadVacations = async () => {
    try {
      const data = await vacationApi.getAll();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Неуспешно зареждане на отпуските. Проверете интернета.",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVacations();
    }, []),
  );

  const refreshHandler = async () => {
    dispatch({ type: "REFRESH_START" });
    await loadVacations();
  };

  const retryHandler = async () => {
    dispatch({ type: "FETCH_START" });
    await loadVacations();
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && vacations.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  const year = new Date().getFullYear();
  const totalDays = DEFAULT_VACATION_DAYS;
  const takenDays = calculatePaidDaysInYear(vacations, year);
  const remainingDays = Math.max(totalDays - takenDays, 0);
  const progress = Math.min(takenDays / totalDays, 1);

  return (
    <FlatList
      data={vacations}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <VacationItem {...item} />}
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
        <View style={styles.header}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Платен отпуск за {year}</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryValue}>{remainingDays}</Text>
              <Text style={styles.summaryText}>
                от {totalDays} дни остават
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${progress * 100}%` }]}
              />
            </View>
            <Text style={styles.summaryHint}>
              Взети и планирани: {takenDays} дни
            </Text>
          </View>

          {vacations.length > 0 && (
            <Text style={styles.subtitle}>
              {vacations.length} {vacations.length === 1 ? "запис" : "записа"}
            </Text>
          )}
        </View>
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Още няма отпуски</Text>
          <Text style={styles.emptyText}>
            Натисни „+“ горе вдясно, за да добавиш първия.
          </Text>
        </View>
      }
    />
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    content: {
      flexGrow: 1,
      padding: 16,
      gap: 10,
    },
    header: {
      gap: 14,
      marginBottom: 4,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 18,
      padding: 16,
      gap: 4,
    },
    summaryLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "600",
    },
    summaryRow: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: 6,
    },
    summaryValue: {
      color: colors.primary,
      fontSize: 32,
      fontWeight: "bold",
    },
    summaryText: {
      color: colors.textMuted,
      fontSize: 14,
    },
    progressTrack: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.divider,
      overflow: "hidden",
      marginTop: 8,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
    },
    summaryHint: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 6,
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
}
