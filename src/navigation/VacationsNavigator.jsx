import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

import VacationsScreen from "../screens/VacationsScreen";
import VacationDetailsScreen from "../screens/VacationDetailsScreen";
import AppHeader from "./AppHeader";

const Stack = createNativeStackNavigator();

export default function VacationsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="VacationsList"
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
        name="VacationsList"
        component={VacationsScreen}
        options={{
          title: "Отпуски",
          headerRight: () => (
            <Link
              screen="AddVacation"
              accessibilityLabel="Нов отпуск"
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="VacationDetails"
        component={VacationDetailsScreen}
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
