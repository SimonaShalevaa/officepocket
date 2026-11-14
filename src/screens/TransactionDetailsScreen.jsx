import { useState, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../theme";
import { transactionApi } from "../api";
import { typeLabels, formatAmount, formatDate } from "../utils/formatUtils";

import DetailsRow from "../components/DetailsRow";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function TransactionDetailsScreen({ route, navigation }) {
  const { transactionId } = route.params;

  const [transaction, setTransaction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTransaction = async () => {
    try {
      const data = await transactionApi.getById(transactionId);
      setTransaction(data);
      setError("");

      if (data) {
        navigation.setOptions({ title: data.title });
      }
    } catch (err) {
      setError("Неуспешно зареждане на записа. Проверете интернета.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadTransaction();
    }, [transactionId]),
  );

  const retryHandler = () => {
    setIsLoading(true);
    loadTransaction();
  };

  const editHandler = () => {
    navigation.navigate("AddTransaction", { transactionId });
  };

  const deleteHandler = () => {
    Alert.alert(
      "Изтриване на запис",
      `Сигурни ли сте, че искате да изтриете „${transaction.title}“? Това не може да бъде отменено.`,
      [
        { text: "Отказ", style: "cancel" },
        { text: "Изтрий", style: "destructive", onPress: confirmDeleteHandler },
      ],
    );
  };

  const confirmDeleteHandler = async () => {
    try {
      await transactionApi.remove(transactionId);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Грешка", "Записът не беше изтрит. Опитайте отново.");
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  if (!transaction) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Записът не е намерен</Text>
      </View>
    );
  }

  const isIncome = transaction.type === "income";

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Сума</Text>
        <Text style={[styles.amount, isIncome && styles.amountIncome]}>
          {formatAmount(transaction.amount, transaction.type)}
        </Text>

        <View style={[styles.badge, !transaction.isPaid && styles.badgePending]}>
          <Text
            style={[
              styles.badgeText,
              !transaction.isPaid && styles.badgeTextPending,
            ]}
          >
            {transaction.isPaid ? "ПЛАТЕНО" : "ЧАКАЩО"}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <DetailsRow label="Тип" value={typeLabels[transaction.type]} />
        <DetailsRow label="Категория" value={transaction.category || "—"} />
        <DetailsRow label="Дата" value={formatDate(transaction.date)} isLast />
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
    paddingVertical: 28,
    alignItems: "center",
    gap: 8,
  },
  summaryLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  amount: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "bold",
  },
  amountIncome: {
    color: colors.primary,
  },
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: 4,
  },
  badgePending: {
    backgroundColor: colors.pendingLight,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  badgeTextPending: {
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
