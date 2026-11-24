import { useReducer, useCallback } from "react";
import { StyleSheet, FlatList, View, Text, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { useThemeContext } from "../contexts/theme/ThemeContext";
import { listReducer, initialListState } from "../reducers/listReducer";
import { documentApi } from "../api";

import DocumentItem from "../components/DocumentItem";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function DocumentsScreen() {
  const { colors } = useThemeContext();
  const styles = createStyles(colors);

  const [state, dispatch] = useReducer(listReducer, initialListState);
  const { items: documents, isLoading, isRefreshing, error } = state;

  const loadDocuments = async () => {
    try {
      const data = await documentApi.getAll();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      dispatch({
        type: "FETCH_ERROR",
        payload: "Неуспешно зареждане на документите. Проверете интернета.",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDocuments();
    }, []),
  );

  const refreshHandler = async () => {
    dispatch({ type: "REFRESH_START" });
    await loadDocuments();
  };

  const retryHandler = async () => {
    dispatch({ type: "FETCH_START" });
    await loadDocuments();
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error && documents.length === 0) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

  return (
    <FlatList
      data={documents}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <DocumentItem {...item} />}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshHandler}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
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

function createStyles(colors) {
  return StyleSheet.create({
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
}
