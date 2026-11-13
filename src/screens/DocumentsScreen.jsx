import { StyleSheet, FlatList, View, Text } from "react-native";

import { colors } from "../theme";
import { useDocumentsContext } from "../contexts/documents/DocumentsContext";

import DocumentItem from "../components/DocumentItem";

export default function DocumentsScreen() {
  const { documents } = useDocumentsContext();

  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DocumentItem {...item} />}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        documents.length > 0 ? (
          <Text style={styles.subtitle}>{documents.length} документа</Text>
        ) : null
      }
      ListEmptyComponent={
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Още няма документи</Text>
          <Text style={styles.emptyText}>
            Натисни „+“ горе вдясно, за да снимаш първия.
          </Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    padding: 16,
    gap: 10,
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: 4,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "bold",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: "center",
  },
});
