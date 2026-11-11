import { useState } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Link } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

import { colors } from "../theme";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
      />
      <FormField
        label="Имейл"
        value={email}
        onChangeText={setEmail}
        placeholder="name@firma.bg"
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <FormField
        label="Парола"
        value={password}
        onChangeText={setPassword}
        placeholder="Поне 6 символа"
        secureTextEntry
      />
      <FormField
        label="Повторете паролата"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Същата парола"
        secureTextEntry
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