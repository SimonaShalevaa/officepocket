import { useState, useRef, useLayoutEffect } from "react";
import { StyleSheet, Text, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";
import {
  validatePassword,
  validateNewPassword,
  validateConfirmPassword,
  hasErrors,
} from "../utils/validation";
import { getAuthErrorMessage } from "../utils/authErrors";
import { successHaptic, errorHaptic } from "../utils/haptics";

import FormField from "../components/FormField";

export default function ChangePasswordScreen({ navigation }) {
  const { changePassword, checkPassword } = useAuthContext();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const changeHandler = (setValue, field) => (text) => {
    setValue(text);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const currentPasswordBlurHandler = async () => {
    if (validatePassword(currentPassword)) {
      return;
    }

    try {
      await checkPassword(currentPassword);
    } catch (error) {
      if (error.response?.data?.error_code === "invalid_credentials") {
        setErrors((prev) => ({
          ...prev,
          currentPassword: "Грешна текуща парола",
        }));
        errorHaptic();
      }
    }
  };

  const saveHandler = async () => {
    if (isSaving) {
      return;
    }

    const newErrors = {
      currentPassword: validatePassword(currentPassword),
      newPassword: validateNewPassword(currentPassword, newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      errorHaptic();
      return;
    }

    setIsSaving(true);

    try {
      await changePassword(currentPassword, newPassword);
      successHaptic();
      Alert.alert("Готово", "Паролата беше сменена успешно.");
      navigation.goBack();
    } catch (error) {
      errorHaptic();

      if (error.response?.data?.error_code === "invalid_credentials") {
        setErrors({ currentPassword: "Грешна текуща парола" });
      } else {
        Alert.alert("Грешка", getAuthErrorMessage(error));
      }

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
  }, [navigation, currentPassword, newPassword, confirmPassword, isSaving]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <FormField
        label="Текуща парола"
        value={currentPassword}
        onChangeText={changeHandler(setCurrentPassword, "currentPassword")}
        error={errors.currentPassword}
        secureTextEntry
        onBlur={currentPasswordBlurHandler}
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => newPasswordRef.current?.focus()}
      />
      <FormField
        ref={newPasswordRef}
        label="Нова парола"
        value={newPassword}
        onChangeText={changeHandler(setNewPassword, "newPassword")}
        error={errors.newPassword}
        placeholder="Поне 6 символа"
        secureTextEntry
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <FormField
        ref={confirmPasswordRef}
        label="Повторете новата парола"
        value={confirmPassword}
        onChangeText={changeHandler(setConfirmPassword, "confirmPassword")}
        error={errors.confirmPassword}
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={saveHandler}
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 18,
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
