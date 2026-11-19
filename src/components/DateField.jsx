import { useState } from "react";
import { StyleSheet, View, Pressable, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "@expo/vector-icons/Ionicons";

import { colors } from "../theme";
import { formatDate, toDateString } from "../utils/formatUtils";

export default function DateField({ label, value, onChange }) {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const valueChangeHandler = (event, selectedDate) => {
    setIsPickerVisible(false);
    onChange(selectedDate);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={({ pressed }) => [styles.input, pressed && styles.inputPressed]}
        onPress={() => setIsPickerVisible(true)}
      >
        <Text style={styles.value}>{formatDate(toDateString(value))}</Text>
        <Ionicons name="calendar-outline" size={20} color={colors.textMuted} />
      </Pressable>

      {isPickerVisible && (
        <DateTimePicker
          value={value}
          mode="date"
          onValueChange={valueChangeHandler}
          onDismiss={() => setIsPickerVisible(false)}
        />
      )}
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
  },
  inputPressed: {
    opacity: 0.7,
  },
  value: {
    color: colors.text,
    fontSize: 16,
  },
});
