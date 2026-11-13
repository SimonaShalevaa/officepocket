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
