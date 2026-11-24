import { StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { useAuthContext } from "../contexts/auth/AuthContext";

import TabsNavigator from "./TabsNavigator";
import AuthNavigator from "./AuthNavigator";
import AddTransactionScreen from "../screens/AddTransactionScreen";
import AddDocumentScreen from "../screens/AddDocumentScreen";
import AddVacationScreen from "../screens/AddVacationScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import ChangePasswordScreen from "../screens/ChangePasswordScreen";
import PendingPaymentsScreen from "../screens/PendingPaymentsScreen";
import TransactionDetailsScreen from "../screens/TransactionDetailsScreen";
import AppHeader from "./AppHeader";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const { colors, isDarkMode, navigationTheme } = useThemeContext();
  const { isAuthenticated, isRestoring } = useAuthContext();

  if (isRestoring) {
    return (
      <View style={[styles.loading, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />

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
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: "Редакция" }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ title: "Смяна на парола" }}
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
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
