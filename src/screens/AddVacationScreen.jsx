import { useState, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";
import { vacationApi } from "../api";
import { toDateString, parseDate } from "../utils/formatUtils";
import {
  DEFAULT_VACATION_DAYS,
  vacationTypeLabels,
  countWorkingDays,
  calculatePaidDaysInYear,
} from "../utils/vacationUtils";
import {
  validateVacationDates,
  validateNote,
  hasErrors,
} from "../utils/validation";
import { successHaptic, errorHaptic } from "../utils/haptics";

import FormField from "../components/FormField";
import TypeSelector from "../components/TypeSelector";
import DateField from "../components/DateField";
import LoadingView from "../components/LoadingView";

export default function AddVacationScreen({ navigation, route }) {
  const vacationId = route.params?.vacationId;
  const isEditMode = !!vacationId;

  const [type, setType] = useState("paid");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    vacationApi
      .getById(vacationId)
      .then((vacation) => {
        setType(vacation.type);
        setStartDate(parseDate(vacation.startDate));
        setEndDate(parseDate(vacation.endDate));
        setNote(vacation.note || "");
      })
      .catch(() => {
        Alert.alert("Грешка", "Отпускът не може да бъде зареден.");
        navigation.goBack();
      })
      .finally(() => setIsLoading(false));
  }, [vacationId]);

  const startDateChangeHandler = (date) => {
    setStartDate(date);

    if (date > endDate) {
      setEndDate(date);
    }

    setErrors((prev) => ({ ...prev, dates: "" }));
  };

  const endDateChangeHandler = (date) => {
    setEndDate(date);
    setErrors((prev) => ({ ...prev, dates: "" }));
  };

  const noteChangeHandler = (text) => {
    setNote(text);
    setErrors((prev) => ({ ...prev, note: "" }));
  };

  const validatePaidDays = async (start, end) => {
    const vacations = await vacationApi.getAll();
    const otherVacations = vacations.filter((item) => item.id !== vacationId);
    const year = Number(start.slice(0, 4));

    const takenDays = calculatePaidDaysInYear(otherVacations, year);
    const newDays = calculatePaidDaysInYear(
      [{ type: "paid", startDate: start, endDate: end }],
      year,
    );
    const remainingDays = Math.max(DEFAULT_VACATION_DAYS - takenDays, 0);

    if (newDays > remainingDays) {
      return `Остават само ${remainingDays} дни платен отпуск за ${year}`;
    }

    return "";
  };

  const saveHandler = async () => {
    if (isSaving) {
      return;
    }

    const start = toDateString(startDate);
    const end = toDateString(endDate);

    const newErrors = {
      dates: validateVacationDates(start, end),
      note: validateNote(note),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      errorHaptic();
      return;
    }

    setIsSaving(true);

    try {
      if (type === "paid") {
        const paidDaysError = await validatePaidDays(start, end);

        if (paidDaysError) {
          setErrors({ dates: paidDaysError });
          errorHaptic();
          setIsSaving(false);
          return;
        }
      }

      const vacationData = {
        type,
        startDate: start,
        endDate: end,
        note: note.trim(),
      };

      if (isEditMode) {
        await vacationApi.update(vacationId, vacationData);
        successHaptic();

        navigation.popTo("MainTabs", {
          screen: "Vacations",
          params: { screen: "VacationsList", pop: true },
        });
      } else {
        await vacationApi.create(vacationData);
        successHaptic();

        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Грешка", "Отпускът не беше запазен. Опитайте отново.");
      setIsSaving(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={saveHandler}
          hitSlop={10}
        >
          <Text style={styles.saveText}>
            {isSaving ? "Запазване..." : "Запази"}
          </Text>
        </Pressable>
      ),
    });
  }, [navigation, type, startDate, endDate, note, isSaving]);

  if (isLoading) {
    return <LoadingView />;
  }

  const workingDays =
    endDate >= startDate
      ? countWorkingDays(toDateString(startDate), toDateString(endDate))
      : 0;

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.content, { paddingBottom: bottom + 16 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.field}>
        <Text style={styles.label}>Вид</Text>
        <TypeSelector
          value={type}
          onChange={setType}
          labels={vacationTypeLabels}
        />
      </View>

      <DateField
        label="От"
        value={startDate}
        onChange={startDateChangeHandler}
      />

      <DateField
        label="До"
        value={endDate}
        onChange={endDateChangeHandler}
        error={errors.dates}
      />

      <View style={styles.infoBox}>
        <Ionicons
          name="information-circle-outline"
          size={20}
          color={colors.primary}
        />
        <Text style={styles.infoText}>
          {workingDays} {workingDays === 1 ? "работен ден" : "работни дни"}{" "}
          (без събота и неделя)
        </Text>
      </View>

      <FormField
        label="Бележка (по избор)"
        value={note}
        onChangeText={noteChangeHandler}
        error={errors.note}
        placeholder="Коледна ваканция"
        maxLength={200}
        returnKeyType="done"
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  infoText: {
    flex: 1,
    color: colors.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    marginRight: 16,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
