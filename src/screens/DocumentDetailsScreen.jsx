import { useState, useCallback } from "react";
import { StyleSheet, View, Text, Image, ScrollView, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { colors } from "../theme";
import { documentApi } from "../api";
import { documentTypeLabels, formatDate } from "../utils/formatUtils";

import DetailsRow from "../components/DetailsRow";
import AppButton from "../components/AppButton";
import LoadingView from "../components/LoadingView";
import ErrorView from "../components/ErrorView";

export default function DocumentDetailsScreen({ route, navigation }) {
  const { documentId } = route.params;

  const [document, setDocument] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocument = async () => {
    try {
      const data = await documentApi.getById(documentId);
      setDocument(data);
      setError("");

      if (data) {
        navigation.setOptions({ title: data.title });
      }
    } catch (err) {
      setError("Неуспешно зареждане на документа. Проверете интернета.");
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDocument();
    }, [documentId]),
  );

  const retryHandler = () => {
    setIsLoading(true);
    loadDocument();
  };

  const deleteHandler = () => {
    Alert.alert(
      "Изтриване на документ",
      `Сигурни ли сте, че искате да изтриете „${document.title}“? Това не може да бъде отменено.`,
      [
        { text: "Отказ", style: "cancel" },
        { text: "Изтрий", style: "destructive", onPress: confirmDeleteHandler },
      ],
    );
  };

  const confirmDeleteHandler = async () => {
    try {
      await documentApi.remove(document);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Грешка", "Документът не беше изтрит. Опитайте отново.");
    }
  };

  if (isLoading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={retryHandler} />;
  }

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
        <Image
          source={{ uri: document.imageUrl }}
          style={styles.image}
        />
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

      <AppButton title="Изтрий" variant="danger" onPress={deleteHandler} />
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
