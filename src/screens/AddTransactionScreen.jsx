import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme";
import { transactionApi } from "../api";

import FormField from "../components/FormField";
import TypeSelector from "../components/TypeSelector";
import LoadingView from "../components/LoadingView";
import {
  validateTitle,
  validateAmount,
  hasErrors,
} from "../utils/validation";

export default function AddTransactionScreen({ navigation, route }) {
  const transactionId = route.params?.transactionId;
  const isEditMode = !!transactionId;

  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
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
        setIsPaid(transaction.isPaid);
      })
      .catch(() => {
        Alert.alert("Грешка", "Записът не може да бъде зареден.");
        navigation.goBack();
      })
      .finally(() => setIsLoading(false));
  }, [transactionId]);

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
      return;
    }

    const transactionData = {
      type,
      title: title.trim(),
      amount: Number(amount.trim().replace(",", ".")),
      isPaid,
    };

    setIsSaving(true);

    try {
      if (isEditMode) {
        await transactionApi.update(transactionId, transactionData);
      } else {
        await transactionApi.create(transactionData);
      }

      navigation.goBack();
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
  }, [navigation, type, title, amount, isPaid, isSaving]);

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
        <TypeSelector value={type} onChange={setType} />
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
