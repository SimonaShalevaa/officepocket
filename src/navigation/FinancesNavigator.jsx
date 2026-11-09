import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme";

import FinancesScreen from "../screens/FinancesScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";

const Stack = createNativeStackNavigator();

export default function FinancesNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="FinancesList"
      screenOptions={{
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
        options={{ title: "Финанси" }}
      />
      <Stack.Screen
        name="TransactionDetails"
        component={TransactionDetailsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}