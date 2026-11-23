import { StyleSheet } from "react-native";
import {
  Header,
  HeaderBackButton,
  getHeaderTitle,
} from "@react-navigation/elements";

export default function AppHeader({ navigation, route, options, back }) {
  return (
    <Header
      {...options}
      title={getHeaderTitle(options, route.name)}
      headerTitleContainerStyle={styles.titleContainer}
      headerRightContainerStyle={styles.rightContainer}
      headerLeft={
        back
          ? (props) => (
              <HeaderBackButton {...props} onPress={navigation.goBack} />
            )
          : undefined
      }
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexShrink: 1,
  },
  rightContainer: {
    flexShrink: 0,
  },
});
