import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

import DocumentsScreen from "../screens/DocumentsScreen";
import DocumentDetailsScreen from "../screens/DocumentDetailsScreen";
import AppHeader from "./AppHeader";

const Stack = createNativeStackNavigator();

export default function DocumentsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="DocumentsList"
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="DocumentsList"
        component={DocumentsScreen}
        options={{
          title: "Документи",
          headerRight: () => (
            <Link
              screen="AddDocument"
              accessibilityLabel="Нов документ"
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="DocumentDetails"
        component={DocumentDetailsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  addButton: {
    marginRight: 16,
  },
});
