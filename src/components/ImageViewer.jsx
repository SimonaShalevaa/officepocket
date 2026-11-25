import { useEffect } from "react";
import { StyleSheet, View, Text, Pressable, Modal } from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  GestureDetector,
  usePinchGesture,
  usePanGesture,
  useTapGesture,
  useSimultaneousGestures,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2;

export default function ImageViewer({ visible, imageUrl, title, onClose }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const resetZoom = () => {
    "worklet";
    scale.value = withTiming(1);
    savedScale.value = 1;
    translateX.value = withTiming(0);
    translateY.value = withTiming(0);
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  useEffect(() => {
    if (!visible) {
      resetZoom();
    }
  }, [visible]);

  const pinchGesture = usePinchGesture({
    onUpdate: (event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(Math.max(newScale, 0.8), MAX_SCALE);
    },
    onDeactivate: () => {
      if (scale.value < MIN_SCALE) {
        resetZoom();
      } else {
        savedScale.value = scale.value;
      }
    },
  });

  const panGesture = usePanGesture({
    onUpdate: (event) => {
      if (savedScale.value > MIN_SCALE) {
        translateX.value = savedTranslateX.value + event.translationX;
        translateY.value = savedTranslateY.value + event.translationY;
      }
    },
    onDeactivate: () => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    },
  });

  const doubleTapGesture = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      if (savedScale.value > MIN_SCALE) {
        resetZoom();
      } else {
        scale.value = withTiming(DOUBLE_TAP_SCALE);
        savedScale.value = DOUBLE_TAP_SCALE;
      }
    },
  });

  const imageGestures = useSimultaneousGestures(
    pinchGesture,
    panGesture,
    doubleTapGesture,
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <Modal
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onClose}
    >
      <StatusBar style="light" />

      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
            <View style={styles.header}>
              <Pressable
                style={({ pressed }) => pressed && styles.pressed}
                onPress={onClose}
                hitSlop={12}
                accessibilityLabel="Назад"
              >
                <Ionicons name="arrow-back" size={26} color="white" />
              </Pressable>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
            </View>

            <View style={styles.imageArea}>
              <GestureDetector gesture={imageGestures}>
                <Animated.Image
                  source={{ uri: imageUrl }}
                  style={[styles.image, animatedStyle]}
                />
              </GestureDetector>
            </View>

            <Text style={styles.hint}>
              Разтворете с два пръста или докоснете два пъти за увеличение
            </Text>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
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
  imageArea: {
    flex: 1,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
  },
  hint: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 12,
  },
});
