import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";

import AuthProvider from "./contexts/auth/AuthProvider";
import RootNavigator from "./navigation/RootNavigator";
import OfflineBanner from "./components/OfflineBanner";

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <StatusBar style="dark" />

          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>

          <OfflineBanner />
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}