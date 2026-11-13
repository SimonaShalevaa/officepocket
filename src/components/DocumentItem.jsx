import { StyleSheet, View, Text, Image } from "react-native";

import { colors } from "../theme";
import { documentTypeLabels, formatDate } from "../utils/formatUtils";

export default function DocumentItem({ title, type, imageUri, createdAt }) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.thumbnail} />

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.meta}>
          {documentTypeLabels[type]} · {formatDate(createdAt.slice(0, 10))}
        </Text>
      </View>
    </View>
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
