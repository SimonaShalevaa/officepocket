import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { colors } from "../theme";

import VacationsScreen from "../screens/VacationsScreen";
import AppHeader from "./AppHeader";

const Stack = createNativeStackNavigator();

export default function VacationsNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="VacationsList"
      screenOptions={{
        header: (props) => <AppHeader {...props} />,
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "bold" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen
        name="VacationsList"
        component={VacationsScreen}
        options={{ title: "Отпуски" }}
      />
    </Stack.Navigator>
  );
}
