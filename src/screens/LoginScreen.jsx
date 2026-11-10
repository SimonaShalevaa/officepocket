import { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { top, bottom } = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const scrollToFormHandler = () => {
    if (isKeyboardVisible) {
      scrollRef.current?.scrollToEnd({ animated: true });
    }
  };

  const loginHandler = () => {
    Alert.alert("Вход", email);
  };

  return (
    <KeyboardAvoidingView
      style={[styles.flex, { paddingTop: top }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: isKeyboardVisible ? 16 : bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
        onLayout={scrollToFormHandler}
        onContentSizeChange={scrollToFormHandler}
      >
        {!isKeyboardVisible && (
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="briefcase-outline" size={26} color={colors.white} />
            </View>
            <Text style={styles.brandName}>OfficePocket</Text>
          </View>
        )}

        <Text style={styles.title}>Добре дошли отново</Text>
        <Text style={styles.subtitle}>
          Влезте, за да видите финансите и документите на фирмата.
        </Text>

        <View style={styles.form}>
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
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 40,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  title: {
    color: colors.text,
    fontSize: 30,
    fontWeight: "bold",
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  form: {
    gap: 18,
    marginTop: 32,
  },
  button: {
    marginTop: 8,
  },
});