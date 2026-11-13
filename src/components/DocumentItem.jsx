import { StyleSheet, View, Text, Image, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { colors } from "../theme";
import { documentTypeLabels, formatDate } from "../utils/formatUtils";

export default function DocumentItem({
  id,
  title,
  type,
  imageUri,
  createdAt,
}) {
  const navigation = useNavigation();

  const pressHandler = () => {
    navigation.navigate("DocumentDetails", { documentId: id, title });
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={pressHandler}
    >
      <Image source={{ uri: imageUri }} style={styles.thumbnail} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta}>
          {documentTypeLabels[type]} · {formatDate(createdAt.slice(0, 10))}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 12,
    gap: 14,
  },
  cardPressed: {
    opacity: 0.6,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: colors.divider,
  },
  info: {
    flex: 1,
  },
  title: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "bold",
  },
  meta: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
});
