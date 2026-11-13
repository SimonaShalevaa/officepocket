import { useState, useRef } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Link, CommonActions } from "@react-navigation/native";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  hasErrors,
} from "../utils/validation";
import { getAuthErrorMessage } from "../utils/authErrors";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const { register } = useAuthContext();

  const changeHandler = (setValue, field) => (text) => {
    setValue(text);
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const registerHandler = async () => {
    const newErrors = {
      name: validateName(name),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      return;
    }

    setIsLoading(true);

    try {
      await register(name.trim(), email.trim(), password);
    } catch (error) {
      Alert.alert("Неуспешна регистрация", getAuthErrorMessage(error));
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Създайте профил"
      subtitle="Регистрирайте се, за да управлявате фирмата си от телефона."
      footer={
        <>
          <Text style={styles.footerText}>Вече имате профил? </Text>
          <Link action={CommonActions.goBack()} style={styles.link}>
            Вход
          </Link>
        </>
      }
    >
      <FormField
        label="Име"
        value={name}
        onChangeText={changeHandler(setName, "name")}
        error={errors.name}
        placeholder="Симона Шалева"
        autoCapitalize="words"
        autoComplete="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => emailRef.current?.focus()}
      />
      <FormField
        ref={emailRef}
        label="Имейл"
        value={email}
        onChangeText={changeHandler(setEmail, "email")}
        error={errors.email}
        placeholder="name@firma.bg"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <FormField
        ref={passwordRef}
        label="Парола"
        value={password}
        onChangeText={changeHandler(setPassword, "password")}
        error={errors.password}
        placeholder="Поне 6 символа"
        secureTextEntry
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => confirmPasswordRef.current?.focus()}
      />
      <FormField
        ref={confirmPasswordRef}
        label="Повторете паролата"
        value={confirmPassword}
        onChangeText={changeHandler(setConfirmPassword, "confirmPassword")}
        error={errors.confirmPassword}
        placeholder="Същата парола"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={registerHandler}
      />

      <AppButton
        title={isLoading ? "Регистриране..." : "Регистрация"}
        onPress={registerHandler}
        disabled={isLoading}
        style={styles.button}
      />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  link: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});