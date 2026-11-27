import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Link } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { useThemeContext } from "../contexts/theme/ThemeContext";

import DashboardScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";

import FinancesNavigator from "./FinancesNavigator";
import DocumentsNavigator from "./DocumentsNavigator";
import VacationsNavigator from "./VacationsNavigator";
import AppHeader from "./AppHeader";

const Tab = createBottomTabNavigator();

export default function TabsNavigator() {
  const { colors } = useThemeContext();
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      backBehavior="history"
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        sceneStyle: { backgroundColor: colors.background },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: "Табло",
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Finances"
        component={FinancesNavigator}
        options={{
          title: "Финанси",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Documents"
        component={DocumentsNavigator}
        options={{
          title: "Документи",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "document-text" : "document-text-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Vacations"
        component={VacationsNavigator}
        options={{
          title: "Отпуски",
          headerShown: false,
          popToTopOnBlur: true,
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Профил",
          headerRight: () => (
            <Link
              screen="Settings"
              accessibilityLabel="Настройки на профила"
              style={styles.settingsButton}
            >
              <Ionicons
                name="person-circle-outline"
                size={26}
                color={colors.primary}
              />
            </Link>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    marginRight: 16,
  },
});
