import { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";

export default function FormField({
  label,
  error,
  secureTextEntry = false,
  ...inputProps
}) {
  const [isTextVisible, setIsTextVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[
            styles.input,
            secureTextEntry && styles.inputWithIcon,
            !!error && styles.inputError,
          ]}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry && !isTextVisible}
          {...inputProps}
        />
        {secureTextEntry && (
          <Pressable
            style={styles.eyeButton}
            onPress={() => setIsTextVisible((prev) => !prev)}
            hitSlop={10}
          >
            <Ionicons
              name={isTextVisible ? "eye-off-outline" : "eye-outline"}
              size={22}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: 6,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "600",
  },
  input: {
    height: 52,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputWithIcon: {
    paddingRight: 52,
  },
  eyeButton: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "500",
  },
});