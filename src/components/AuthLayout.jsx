import { StyleSheet, View, Text } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

export default function AuthLayout({ title, subtitle, children, footer }) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={[styles.flex, { paddingTop: top }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        bottomOffset={96}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="briefcase-outline" size={26} color={colors.white} />
          </View>
          <Text style={styles.brandName}>OfficePocket</Text>
        </View>

        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>

        <View style={styles.form}>{children}</View>

        {footer && <View style={styles.footer}>{footer}</View>}
      </KeyboardAwareScrollView>
    </View>
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
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },
});
