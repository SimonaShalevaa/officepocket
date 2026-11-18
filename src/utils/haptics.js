import { Platform, Vibration } from "react-native";
import * as Haptics from "expo-haptics";

const isAndroid = Platform.OS === "android";

export function successHaptic() {
  if (isAndroid) {
    Vibration.vibrate(70);
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }
}

export function errorHaptic() {
  if (isAndroid) {
    Vibration.vibrate([0, 80, 80, 80]);
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  }
}

export function warningHaptic() {
  if (isAndroid) {
    Vibration.vibrate(150);
  } else {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  }
}

export function selectionHaptic() {
  if (isAndroid) {
    Vibration.vibrate(40);
  } else {
    Haptics.selectionAsync();
  }
}
