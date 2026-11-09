import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

import TabsNavigator from "./navigation/TabsNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />

      <NavigationContainer>
        <TabsNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}