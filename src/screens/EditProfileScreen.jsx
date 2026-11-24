import { useState, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { useAuthContext } from "../contexts/auth/AuthContext";
import { validateName } from "../utils/validation";
import { successHaptic, errorHaptic } from "../utils/haptics";

import FormField from "../components/FormField";

export default function EditProfileScreen({ navigation }) {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const { user, updateName } = useAuthContext();

  const [name, setName] = useState(user.name);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const nameChangeHandler = (text) => {
    setName(text);
    setError("");
  };

  const saveHandler = async () => {
    if (isSaving) {
      return;
    }

    const nameError = validateName(name);
    setError(nameError);

    if (nameError) {
      errorHaptic();
      return;
    }

    setIsSaving(true);

    try {
      await updateName(name.trim());
      successHaptic();
      navigation.goBack();
    } catch (err) {
      Alert.alert("Грешка", "Името не беше запазено. Опитайте отново.");
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
  }, [navigation, colors, name, isSaving]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <FormField
        label="Име"
        value={name}
        onChangeText={nameChangeHandler}
        error={error}
        placeholder="Иван Иванов"
        autoComplete="name"
        maxLength={50}
        returnKeyType="done"
        onSubmitEditing={saveHandler}
      />

      <View style={styles.infoBox}>
        <Text style={styles.infoLabel}>Имейл</Text>
        <Text style={styles.infoValue}>{user.email}</Text>
        <Text style={styles.infoHint}>Имейлът не може да се променя.</Text>
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
    infoBox: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      gap: 4,
    },
    infoLabel: {
      color: colors.textMuted,
      fontSize: 13,
      fontWeight: "600",
    },
    infoValue: {
      color: colors.text,
      fontSize: 16,
    },
    infoHint: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 4,
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
