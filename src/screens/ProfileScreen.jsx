import { StyleSheet, View, Text } from "react-native";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";

import AppButton from "../components/AppButton";

export default function ProfileScreen() {
  const { user, logout } = useAuthContext();

  return (
    <View style={styles.container}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <AppButton
        title="Изход"
        variant="outline"
        onPress={logout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 4,
  },
  logoutButton: {
    alignSelf: "stretch",
    marginTop: 32,
  },
});