import { useState, useRef } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Link, CommonActions } from "@react-navigation/native";

import { colors } from "../theme";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const registerHandler = () => {
    Alert.alert("Регистрация", `${name}\n${email}`);
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
        onChangeText={setName}
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
        onChangeText={setEmail}
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
        onChangeText={setPassword}
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
        onChangeText={setConfirmPassword}
        placeholder="Същата парола"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={registerHandler}
      />

      <AppButton
        title="Регистрация"
        onPress={registerHandler}
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
