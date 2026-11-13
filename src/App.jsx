import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { StatusBar } from "expo-status-bar";

import AuthProvider from "./contexts/auth/AuthProvider";
import DocumentsProvider from "./contexts/documents/DocumentsProvider";
import RootNavigator from "./navigation/RootNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <KeyboardProvider>
        <AuthProvider>
          <DocumentsProvider>
            <StatusBar style="dark" />

            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </DocumentsProvider>
        </AuthProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}