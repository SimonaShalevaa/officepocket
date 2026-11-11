import { useState, useRef } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Link } from "@react-navigation/native";

import { colors } from "../theme";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const passwordRef = useRef(null);

  const loginHandler = () => {
    Alert.alert("Вход", email);
  };

  return (
    <AuthLayout
      title="Добре дошли отново"
      subtitle="Влезте, за да видите финансите и документите на фирмата."
      footer={
        <>
          <Text style={styles.footerText}>Нямате профил? </Text>
          <Link screen="Register" style={styles.link}>
            Регистрация
          </Link>
        </>
      }
    >
      <FormField
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
        returnKeyType="done"
        onSubmitEditing={loginHandler}
      />

      <AppButton title="Вход" onPress={loginHandler} style={styles.button} />
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
