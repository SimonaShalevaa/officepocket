import { StyleSheet, View, ActivityIndicator } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";

import TabsNavigator from "./TabsNavigator";
import AuthNavigator from "./AuthNavigator";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddDocumentScreen from "../screens/AddDocumentScreen";
import AddVacationScreen from "../screens/AddVacationScreen";
import PendingPaymentsScreen from "../screens/PendingPaymentsScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import AppHeader from "./AppHeader";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { isAuthenticated, isRestoring } = useAuthContext();

  if (isRestoring) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
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
            options={({ route }) => ({
              title: route.params?.transactionId ? "Редакция" : "Нов запис",
            })}
          />
          <Stack.Screen
            name="AddVacation"
            component={AddVacationScreen}
            options={({ route }) => ({
              title: route.params?.vacationId ? "Редакция" : "Нов отпуск",
            })}
          />
          <Stack.Screen
            name="PendingPayments"
            component={PendingPaymentsScreen}
            options={{ title: "Чакащи плащания" }}
          />
          <Stack.Screen
            name="TransactionDetails"
            component={TransactionDetailsScreen}
            options={({ route }) => ({ title: route.params.title })}
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

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
});
