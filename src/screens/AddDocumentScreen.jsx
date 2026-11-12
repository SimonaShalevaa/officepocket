import { useState, useLayoutEffect } from "react";
import { StyleSheet, View, Text, Image, Pressable, Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";
import { documentTypeLabels } from "../utils/formatUtils";
import {
  validateTitle,
  validateImage,
  hasErrors,
} from "../utils/validation";

import FormField from "../components/FormField";
import AppButton from "../components/AppButton";
import TypeSelector from "../components/TypeSelector";

export default function AddDocumentScreen({ navigation }) {
  const [imageUri, setImageUri] = useState(null);
  const [type, setType] = useState("invoice");
  const [title, setTitle] = useState("");
  const [errors, setErrors] = useState({});

  const { bottom } = useSafeAreaInsets();

  const setImageFromResult = (result) => {
    if (result.canceled) {
      return;
    }

    setImageUri(result.assets[0].uri);
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const takePhotoHandler = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Няма достъп до камерата",
        "Разрешете достъп до камерата от настройките на телефона, за да снимате документи.",
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    setImageFromResult(result);
  };

  const pickImageHandler = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    setImageFromResult(result);
  };

  const titleChangeHandler = (text) => {
    setTitle(text);
    setErrors((prev) => ({ ...prev, title: "" }));
  };

  const saveHandler = () => {
    const newErrors = {
      image: validateImage(imageUri),
      title: validateTitle(title),
    };

    setErrors(newErrors);

    if (hasErrors(newErrors)) {
      return;
    }

    Alert.alert("Нов документ", `${documentTypeLabels[type]}\n${title}`, [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]}
          onPress={saveHandler}
          hitSlop={10}
        >
          <Text style={styles.saveText}>Запази</Text>
        </Pressable>
      ),
    });
  }, [navigation, imageUri, type, title]);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.content, { paddingBottom: bottom + 16 }]}
      keyboardShouldPersistTaps="handled"
      bottomOffset={24}
    >
      <View style={styles.field}>
        <View
          style={[styles.preview, !!errors.image && styles.previewError]}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons
                name="document-text-outline"
                size={48}
                color={colors.textMuted}
              />
              <Text style={styles.placeholderText}>Няма снимка</Text>
            </View>
          )}
        </View>
        {!!errors.image && <Text style={styles.error}>{errors.image}</Text>}
      </View>

      <View style={styles.buttons}>
        <AppButton
          title="Камера"
          onPress={takePhotoHandler}
          style={styles.button}
        />
        <AppButton
          title="Галерия"
          variant="outline"
          onPress={pickImageHandler}
          style={styles.button}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Вид документ</Text>
        <TypeSelector
          value={type}
          onChange={setType}
          labels={documentTypeLabels}
        />
      </View>

      <FormField
        label="Описание"
        value={title}
        onChangeText={titleChangeHandler}
        placeholder="Фактура за наем – ноември"
        error={errors.title}
        returnKeyType="done"
      />
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 18,
  },
  field: {
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  preview: {
    height: 280,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderStyle: "dashed",
    overflow: "hidden",
  },
  previewError: {
    borderColor: colors.error,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderText: {
    color: colors.textMuted,
    fontSize: 15,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    flex: 1,
  },
  saveButton: {
    marginRight: 16,
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  saveButtonPressed: {
    opacity: 0.8,
  },
  saveText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
});
