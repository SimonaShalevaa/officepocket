import { useState, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme";

import TypeSelector from "../components/TypeSelector";
import { typeLabels } from "../utils/formatUtils";

export default function AddTransactionScreen({ navigation }) {
  const [type, setType] = useState("expense");
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [isPaid, setIsPaid] = useState(true);

  const headerHeight = useHeaderHeight();
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
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? headerHeight : 0}
    >
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.field}>
          <Text style={styles.label}>Тип</Text>
          <TypeSelector value={type} onChange={setType} />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Описание</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Канцеларски материали"
            placeholderTextColor={colors.textMuted}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Сума (€)</Text>
          <TextInput
            style={styles.input}
            value={amount}
            onChangeText={setAmount}
            placeholder="0,00"
            placeholderTextColor={colors.textMuted}
            keyboardType="decimal-pad"
          />
        </View>

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

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
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
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
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
