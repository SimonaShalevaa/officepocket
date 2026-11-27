import { StyleSheet, View } from "react-native";
import {
  Header,
  HeaderBackButton,
  getHeaderTitle,
} from "@react-navigation/elements";

import OfflineBanner from "../components/OfflineBanner";

export default function AppHeader({ navigation, route, options, back }) {
  return (
    <View>
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
      <OfflineBanner />
    </View>
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
