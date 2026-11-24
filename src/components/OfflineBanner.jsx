import { StyleSheet, View, Text } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useThemeContext } from "../contexts/theme/ThemeContext";

export default function OfflineBanner() {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const { isConnected } = useNetInfo();
  const { bottom } = useSafeAreaInsets();

  if (isConnected !== false) {
    return null;
  }

  return (
    <View
      style={[styles.banner, { bottom: bottom + 64 }]}
      pointerEvents="none"
    >
      <Ionicons name="cloud-offline-outline" size={18} color={colors.white} />
      <Text style={styles.text}>Няма връзка с интернет</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    banner: {
      position: "absolute",
      alignSelf: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: colors.error,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
    },
    text: {
      color: colors.white,
      fontSize: 14,
      fontWeight: "bold",
    },
  });
}
