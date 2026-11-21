import { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../theme";
import { vacationApi } from "../api";
import { formatDate } from "../utils/formatUtils";
import {
  vacationTypeLabels,
  vacationStatusLabels,
  countWorkingDays,
  getVacationStatus,
} from "../utils/vacationUtils";
import { warningHaptic } from "../utils/haptics";

import DetailsRow from "../components/DetailsRow";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function VacationDetailsScreen({ route, navigation }) {
  const { vacationId } = route.params;

  const [vacation, setVacation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadVacation = async () => {
    try {
      const data = await vacationApi.getById(vacationId);
      setVacation(data);
      setError("");
    } catch (err) {
      setError("Неуспешно зареждане на отпуска. Проверете интернета.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadVacation();
    }, [vacationId]),
  );

  const refreshHandler = async () => {
    setIsRefreshing(true);
    await loadVacation();
    setIsRefreshing(false);
  };

  const retryHandler = () => {
    setIsLoading(true);
    loadVacation();
  };

  const editHandler = () => {
    navigation.navigate("AddVacation", { vacationId });
  };

  const deleteHandler = () => {
    Alert.alert(
      "Изтриване на отпуск",
      "Сигурни ли сте, че искате да изтриете този отпуск? Това не може да бъде отменено.",
      [
        { text: "Отказ", style: "cancel" },
        { text: "Изтрий", style: "destructive", onPress: confirmDeleteHandler },
      ],
    );
  };

  const confirmDeleteHandler = async () => {
    try {
      await vacationApi.remove(vacationId);
      warningHaptic();
      navigation.goBack();
    } catch (err) {
      Alert.alert("Грешка", "Отпускът не беше изтрит. Опитайте отново.");
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  if (!vacation) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Отпускът не е намерен</Text>
      </View>
    );
  }

  const status = getVacationStatus(vacation);
  const days = countWorkingDays(vacation.startDate, vacation.endDate);
  const isUpcoming = status === "upcoming";

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
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Период</Text>
        <Text style={styles.period}>
          {formatDate(vacation.startDate)} – {formatDate(vacation.endDate)}
        </Text>

        <View style={[styles.badge, isUpcoming && styles.badgeUpcoming]}>
          <Text
            style={[styles.badgeText, isUpcoming && styles.badgeTextUpcoming]}
          >
            {vacationStatusLabels[status]}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <DetailsRow label="Вид" value={vacationTypeLabels[vacation.type]} />
        <DetailsRow
          label="Работни дни"
          value={`${days} ${days === 1 ? "ден" : "дни"}`}
        />
        <DetailsRow label="Бележка" value={vacation.note || "—"} isLast />
      </View>

      <View style={styles.actions}>
        <AppButton
          title="Редактирай"
          variant="outline"
          onPress={editHandler}
          style={styles.actionButton}
        />
        <AppButton
          title="Изтрий"
          variant="danger"
          onPress={deleteHandler}
          style={styles.actionButton}
        />
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
    paddingVertical: 26,
    paddingHorizontal: 16,
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  period: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 4,
  },
  badgeUpcoming: {
    backgroundColor: colors.pendingLight,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextUpcoming: {
    color: colors.pending,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
});
