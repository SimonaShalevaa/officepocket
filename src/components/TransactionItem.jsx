import { StyleSheet, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../theme";
import { typeLabels, formatAmount, formatDate } from "../utils/formatUtils";

export default function TransactionItem({
  id,
  title,
  type,
  category,
  amount,
  date,
  isPaid,
}) {
  const navigation = useNavigation();
  const isIncome = type === "income";

  const pressHandler = () => {
    navigation.navigate("TransactionDetails", { transactionId: id, title });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={pressHandler}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.meta}>
          {[typeLabels[type], category, formatDate(date)]
            .filter(Boolean)
            .join(" · ")}
        </Text>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amount, isIncome && styles.amountIncome]}>
          {formatAmount(amount, type)}
        </Text>
        <Text style={[styles.status, !isPaid && styles.statusPending]}>
          {isPaid ? "ПЛАТЕНО" : "ЧАКАЩО"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardPressed: {
    opacity: 0.6,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  right: {
    alignItems: "flex-end",
  },
  amount: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  amountIncome: {
    color: colors.primary,
  },
  status: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 4,
  },
  statusPending: {
    color: colors.pending,
  },
});