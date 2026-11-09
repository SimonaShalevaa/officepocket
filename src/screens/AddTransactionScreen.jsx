import { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors } from "../theme";

import AppButton from "../components/AppButton";

export default function AddTransactionScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");

  const headerHeight = useHeaderHeight();
  const { bottom } = useSafeAreaInsets();

  const saveHandler = () => {
    Alert.alert("Нов запис", `${title}\n${amount} €`, [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

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

        <View style={styles.spacer} />

        <AppButton title="Запази" onPress={saveHandler} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
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
  spacer: {
    flex: 1,
  },
});
