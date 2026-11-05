import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Ionicons from '@expo/vector-icons/Ionicons';

import { colors } from './theme';

import DashboardScreen from './screens/DashboardScreen';
import FinancesScreen from './screens/FinancesScreen';

const Tab = createBottomTabNavigator();

export default function App() {
    return (
        <SafeAreaProvider>
            <StatusBar style="dark" />

            <NavigationContainer>
                <Tab.Navigator
                    initialRouteName="Dashboard"
                    screenOptions={{
                        headerStyle: { backgroundColor: colors.background },
                        headerTintColor: colors.text,
                        headerTitleStyle: { fontWeight: 'bold' },
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
                            fontWeight: '600',
                        },
                    }}
                >
                    <Tab.Screen
                        name="Dashboard"
                        component={DashboardScreen}
                        options={{
                            title: 'Табло',
                            tabBarIcon: ({ focused, color, size }) => (
                                <Ionicons name={focused ? 'home' : 'home-outline'} size={size} color={color} />
                            ),
                        }}
                    />
                    <Tab.Screen
                        name="Finances"
                        component={FinancesScreen}
                        options={{
                            title: 'Финанси',
                            tabBarIcon: ({ focused, color, size }) => (
                                <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={size} color={color} />
                            ),
                        }}
                    />
                </Tab.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}