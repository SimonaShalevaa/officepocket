import { StyleSheet, View, Text, Image, ScrollView } from "react-native";

import { colors } from "../theme";
import { useDocumentsContext } from "../contexts/documents/DocumentsContext";
import { documentTypeLabels, formatDate } from "../utils/formatUtils";

import DetailsRow from "../components/DetailsRow";

export default function DocumentDetailsScreen({ route }) {
  const { documentId } = route.params;
  const { documents } = useDocumentsContext();

  const document = documents.find((item) => item.id === documentId);

  if (!document) {
    return (
      <View style={styles.centered}>
        <Text style={styles.notFound}>Документът не е намерен</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.imageBox}>
        <Image source={{ uri: document.imageUri }} style={styles.image} />
      </View>

      <View style={styles.infoBox}>
        <DetailsRow label="Вид" value={documentTypeLabels[document.type]} />
        <DetailsRow label="Описание" value={document.title} />
        <DetailsRow
          label="Добавен на"
          value={formatDate(document.createdAt.slice(0, 10))}
          isLast
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    gap: 16,
  },
  centered: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    color: colors.textMuted,
    fontSize: 16,
  },
  imageBox: {
    backgroundColor: colors.card,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    aspectRatio: 3 / 4,
    resizeMode: "contain",
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
});
