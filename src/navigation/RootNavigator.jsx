import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header, getHeaderTitle } from "@react-navigation/elements";

import { colors } from "../theme";

import TabsNavigator from "./TabsNavigator";
import AddTransactionScreen from "../screens/AddTransactionScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator
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
        name="MainTabs"
        component={TabsNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddTransactionScreen}
        options={{ title: "Нов запис" }}
      />
    </Stack.Navigator>
  );
}