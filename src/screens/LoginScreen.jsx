import { useState, useRef } from "react";
import { StyleSheet, Text, Alert } from "react-native";
import { Link } from "@react-navigation/native";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";
import {
  validateEmail,
  validatePassword,
  hasErrors,
} from "../utils/validation";
import { getAuthErrorMessage } from "../utils/authErrors";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordRef = useRef(null);

  const { login } = useAuthContext();

  const emailChangeHandler = (text) => {
    setEmail(text);
    setErrors((prev) => ({ ...prev, email: "" }));
  };

  const passwordChangeHandler = (text) => {
    setPassword(text);
    setErrors((prev) => ({ ...prev, password: "" }));
  };

  const loginHandler = async () => {
    const newErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      return;
    }

    setIsLoading(true);

    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert("Неуспешен вход", getAuthErrorMessage(error));
      setIsLoading(false);
    }
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
        onChangeText={emailChangeHandler}
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
        onChangeText={passwordChangeHandler}
        error={errors.password}
        placeholder="Поне 6 символа"
        secureTextEntry
        returnKeyType="done"
        onSubmitEditing={loginHandler}
      />

      <AppButton
        title={isLoading ? "Влизане..." : "Вход"}
        onPress={loginHandler}
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