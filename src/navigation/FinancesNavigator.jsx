import { StyleSheet } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header, getHeaderTitle } from "@react-navigation/elements";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

import FinancesScreen from "../screens/FinancesScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";

const Stack = createNativeStackNavigator();

export default function FinancesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FinancesList"
      screenOptions={{
        header: ({ options, route, back }) => (
          <Header
            {...options}
            title={getHeaderTitle(options, route.name)}
            back={back}
          />
        ),
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="FinancesList"
        component={FinancesScreen}
        options={{
          title: "Финанси",
          headerRight: () => (
            <Link
              screen="AddTransaction"
              accessibilityLabel="Нов запис"
              style={styles.addButton}
            >
              <Ionicons name="add-circle" size={32} color={colors.primary} />
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
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
