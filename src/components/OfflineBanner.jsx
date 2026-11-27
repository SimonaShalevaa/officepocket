import { StyleSheet, View, Text } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useThemeContext } from "../contexts/theme/ThemeContext";

export default function OfflineBanner() {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const { isConnected } = useNetInfo();

  if (isConnected !== false) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <Ionicons name="cloud-offline-outline" size={16} color={colors.white} />
      <Text style={styles.text}>Няма връзка с интернет</Text>
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    banner: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.error,
      paddingVertical: 6,
    },
    text: {
      color: colors.white,
      fontSize: 13,
      fontWeight: "bold",
    },
  });
}
