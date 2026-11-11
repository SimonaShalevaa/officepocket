import { useState, useRef, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert, Switch } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme";

import FormField from "../components/FormField";
import TypeSelector from "../components/TypeSelector";
import { typeLabels } from "../utils/formatUtils";

export default function AddTransactionScreen({ navigation }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(true);

  const amountRef = useRef(null);
  const { bottom } = useSafeAreaInsets();

  const saveHandler = () => {
    Alert.alert(
      "Нов запис",
      `${typeLabels[type]}\n${title}\n${amount} €\n${isPaid ? "Платено" : "Чакащо"}`,
      [{ text: "OK", onPress: () => navigation.goBack() }],
    );
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
          <Text style={styles.saveText}>Запази</Text>
        </Pressable>
      ),
    });
  }, [navigation, type, title, amount, isPaid]);

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
        onChangeText={setTitle}
        placeholder="Канцеларски материали"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => amountRef.current?.focus()}
      />

      <FormField
        ref={amountRef}
        label="Сума (€)"
        value={amount}
        onChangeText={setAmount}
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
