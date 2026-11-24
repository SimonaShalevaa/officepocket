import { StyleSheet, View, ActivityIndicator } from "react-native";

import { useThemeContext } from "../contexts/theme/ThemeContext";

export default function LoadingView() {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}

function createStyles(colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
  });
}
