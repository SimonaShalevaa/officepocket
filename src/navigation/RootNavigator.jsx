import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Header, getHeaderTitle } from "@react-navigation/elements";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";

import TabsNavigator from "./TabsNavigator";
import AuthNavigator from "./AuthNavigator";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddDocumentScreen from "../screens/AddDocumentScreen";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated } = useAuthContext();

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
      {isAuthenticated ? (
        <>
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
          <Stack.Screen
            name="AddDocument"
            component={AddDocumentScreen}
            options={{ title: "Нов документ" }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}