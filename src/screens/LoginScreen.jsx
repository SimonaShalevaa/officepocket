import { useState } from "react";
import { StyleSheet, Alert } from "react-native";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import AuthLayout from "../components/AuthLayout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = () => {
    Alert.alert("Вход", email);
  };

  return (
    <AuthLayout
      title="Добре дошли отново"
      subtitle="Влезте, за да видите финансите и документите на фирмата."
    >
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

      <AppButton title="Вход" onPress={loginHandler} style={styles.button} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 8,
  },
});