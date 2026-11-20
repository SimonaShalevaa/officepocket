import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";
import { formatDate } from "../utils/formatUtils";
import {
  vacationTypeLabels,
  vacationStatusLabels,
  countWorkingDays,
  getVacationStatus,
} from "../utils/vacationUtils";

export default function VacationItem({ type, startDate, endDate }) {
  const status = getVacationStatus({ startDate, endDate });
  const days = countWorkingDays(startDate, endDate);

  return (
    <View style={styles.card}>
      <View style={styles.info}>
        <Text style={styles.title}>
          {formatDate(startDate)} – {formatDate(endDate)}
        </Text>
        <Text style={styles.meta}>
          {vacationTypeLabels[type]} · {days}{" "}
          {days === 1 ? "работен ден" : "работни дни"}
        </Text>
      </View>

      <View
        style={[styles.badge, status === "upcoming" && styles.badgeUpcoming]}
      >
        <Text
          style={[
            styles.badgeText,
            status === "upcoming" && styles.badgeTextUpcoming,
          ]}
        >
          {vacationStatusLabels[status]}
        </Text>
      </View>
    </View>
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
  badge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeUpcoming: {
    backgroundColor: colors.pendingLight,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "bold",
  },
  badgeTextUpcoming: {
    color: colors.pending,
  },
});
