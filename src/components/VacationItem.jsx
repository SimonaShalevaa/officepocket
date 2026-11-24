import { StyleSheet, View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { formatDate } from "../utils/formatUtils";
import {
  vacationTypeLabels,
  vacationStatusLabels,
  countWorkingDays,
  getVacationStatus,
} from "../utils/vacationUtils";

export default function VacationItem({ id, type, startDate, endDate }) {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const navigation = useNavigation();
  const status = getVacationStatus({ startDate, endDate });
  const days = countWorkingDays(startDate, endDate);
  const period = `${formatDate(startDate)} – ${formatDate(endDate)}`;

  const pressHandler = () => {
    navigation.navigate("VacationDetails", { vacationId: id, title: period });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={pressHandler}
    >
      <View style={styles.info}>
        <Text style={styles.title}>{period}</Text>
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
    </Pressable>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
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
}
