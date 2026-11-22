import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  Alert,
  Linking,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";
import { useAuthContext } from "../contexts/auth/AuthContext";
import { avatarApi } from "../api";
import { successHaptic } from "../utils/haptics";

import AppButton from "../components/AppButton";

export default function ProfileScreen({ navigation }) {
  const { user, logout, updateAvatar, removeAvatar } = useAuthContext();

  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user.avatarPath) {
      setAvatarUrl(null);
      return;
    }

    avatarApi
      .getUrl(user.avatarPath)
      .then(setAvatarUrl)
      .catch(() => setAvatarUrl(null));
  }, [user.avatarPath]);

  const saveAvatar = async (result) => {
    if (result.canceled) {
      return;
    }

    setIsSaving(true);

    try {
      await updateAvatar(result.assets[0].uri);
      successHaptic();
    } catch (err) {
      Alert.alert("Грешка", "Снимката не беше запазена. Опитайте отново.");
    } finally {
      setIsSaving(false);
    }
  };

  const takePhotoHandler = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Няма достъп до камерата",
        "Разрешете достъп до камерата от настройките на телефона, за да направите профилна снимка.",
        [
          { text: "Отказ", style: "cancel" },
          { text: "Отвори настройки", onPress: () => Linking.openSettings() },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    await saveAvatar(result);
  };

  const pickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    await saveAvatar(result);
  };

  const removeAvatarHandler = async () => {
    setIsSaving(true);

    try {
      await removeAvatar();
    } catch (err) {
      Alert.alert("Грешка", "Снимката не беше премахната. Опитайте отново.");
    } finally {
      setIsSaving(false);
    }
  };

  const avatarPressHandler = () => {
    const buttons = [
      { text: "Снимай", onPress: takePhotoHandler },
      { text: "От галерията", onPress: pickImageHandler },
    ];

    if (user.avatarPath) {
      buttons.push({
        text: "Премахни",
        style: "destructive",
        onPress: removeAvatarHandler,
      });
    } else {
      buttons.push({ text: "Отказ", style: "cancel" });
    }

    Alert.alert("Профилна снимка", "Изберете откъде да е снимката.", buttons, {
      cancelable: true,
    });
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.avatar, pressed && styles.pressed]}
        onPress={avatarPressHandler}
        disabled={isSaving}
        accessibilityLabel="Профилна снимка"
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        )}

        {isSaving && (
          <View style={styles.avatarOverlay}>
            <ActivityIndicator color={colors.white} />
          </View>
        )}

        <View style={styles.cameraBadge}>
          <Ionicons name="camera" size={16} color={colors.white} />
        </View>
      </Pressable>

      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.email}>{user.email}</Text>

      <AppButton
        title="Редактирай профила"
        onPress={() => navigation.navigate("EditProfile")}
        style={styles.editButton}
      />

      <AppButton
        title="Изход"
        variant="outline"
        onPress={logout}
        style={styles.logoutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  pressed: {
    opacity: 0.8,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 44,
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 44,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.primary,
    fontSize: 36,
    fontWeight: "bold",
  },
  name: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "bold",
  },
  email: {
    color: colors.textMuted,
    fontSize: 15,
    marginTop: 4,
  },
  editButton: {
    alignSelf: "stretch",
    marginTop: 32,
  },
  logoutButton: {
    alignSelf: "stretch",
    marginTop: 12,
  },
});