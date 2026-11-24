import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { errorHaptic, successHaptic } from "../utils/haptics";
import { transactionApi } from "../api";
import {
  categoryOptions,
  toDateString,
  parseDate,
} from "../utils/formatUtils";

import FormField from "../components/FormField";
import TypeSelector from "../components/TypeSelector";
import CategorySelector from "../components/CategorySelector";
import DateField from "../components/DateField";
import LoadingView from "../components/LoadingView";
import {
  validateTitle,
  validateAmount,
  hasErrors,
} from "../utils/validation";

export default function AddTransactionScreen({ navigation, route }) {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const transactionId = route.params?.transactionId;
  const isEditMode = !!transactionId;

  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date());
  const [isPaid, setIsPaid] = useState(true);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);

  const amountRef = useRef(null);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    transactionApi
      .getById(transactionId)
      .then((transaction) => {
        setType(transaction.type);
        setTitle(transaction.title);
        setAmount(String(transaction.amount).replace(".", ","));
        setCategory(transaction.category || "");
        setDate(parseDate(transaction.date));
        setIsPaid(transaction.isPaid);
      })
      .catch(() => {
        Alert.alert("Грешка", "Записът не може да бъде зареден.");
        navigation.goBack();
      })
      .finally(() => setIsLoading(false));
  }, [transactionId]);

  const typeChangeHandler = (newType) => {
    setType(newType);

    if (!categoryOptions[newType].includes(category)) {
      setCategory("");
    }
  };

  const titleChangeHandler = (text) => {
    setTitle(text);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const amountChangeHandler = (text) => {
    setAmount(text);
    setErrors((prev) => ({ ...prev, amount: "" }));
  };

  const saveHandler = async () => {
    if (isSaving) {
      return;
    }

    const newErrors = {
      title: validateTitle(title),
      amount: validateAmount(amount),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      errorHaptic();
      return;
    }

    const transactionData = {
      type,
      title: title.trim(),
      category,
      amount: Number(amount.trim().replace(",", ".")),
      date: toDateString(date),
      isPaid,
    };

    setIsSaving(true);

    try {
      if (isEditMode) {
        await transactionApi.update(transactionId, transactionData);
        successHaptic();

        if (route.params?.fromPending) {
          navigation.popTo("PendingPayments");
        } else {
          navigation.popTo("MainTabs", {
            screen: "Finances",
            params: { screen: "FinancesList", pop: true },
          });
        }
      } else {
        await transactionApi.create(transactionData);
        successHaptic();

        navigation.goBack();
      }
    } catch (error) {
      Alert.alert("Грешка", "Записът не беше запазен. Опитайте отново.");
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
  }, [
    navigation,
    colors,
    type,
    title,
    category,
    amount,
    date,
    isPaid,
    isSaving,
  ]);

  if (isLoading) {
    return <LoadingView />;
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.content, { paddingBottom: bottom + 16 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.field}>
        <Text style={styles.label}>Тип</Text>
        <TypeSelector value={type} onChange={typeChangeHandler} />
      </View>

      <FormField
        label="Описание"
        value={title}
        onChangeText={titleChangeHandler}
        error={errors.title}
        placeholder="Канцеларски материали"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => amountRef.current?.focus()}
      />

      <FormField
        ref={amountRef}
        label="Сума (€)"
        value={amount}
        onChangeText={amountChangeHandler}
        error={errors.amount}
        placeholder="0,00"
        keyboardType="decimal-pad"
      />

      {categoryOptions[type].length > 0 && (
        <View style={styles.field}>
          <Text style={styles.label}>Категория (по избор)</Text>
          <CategorySelector
            options={categoryOptions[type]}
            value={category}
            onChange={setCategory}
          />
        </View>
      )}

      <DateField label="Дата" value={date} onChange={setDate} />

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchTitle}>Платено</Text>
          <Text style={styles.switchSubtitle}>
            Изключи, ако плащането предстои
          </Text>
        </View>
        <Switch
          value={isPaid}
          onValueChange={setIsPaid}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor={colors.white}
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
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
    switchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    switchInfo: {
      flex: 1,
    },
    switchTitle: {
      color: colors.text,
      fontSize: 15,
      fontWeight: "bold",
    },
    switchSubtitle: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    saveButton: {
      marginRight: 16,
      backgroundColor: colors.primaryButton,
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
}
