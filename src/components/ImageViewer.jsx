import { StyleSheet, View, Text, Image, Pressable, Modal } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ImageViewer({ visible, imageUrl, title, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar style="light" />

      <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
          <View style={styles.header}>
            <Pressable
              style={({ pressed }) => pressed && styles.pressed}
              onPress={onClose}
              hitSlop={12}
              accessibilityLabel="Назад"
            >
              <Ionicons name="arrow-back" size={26} color={"white"} />
            </Pressable>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>

          <Image source={{ uri: imageUrl }} style={styles.image} />
        </SafeAreaView>
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  pressed: {
    opacity: 0.6,
  },
  title: {
    flex: 1,
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
    flex: 1,
    width: "100%",
    marginBottom: 24,
    resizeMode: "contain",
  },
});
