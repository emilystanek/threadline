
import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRoute } from "@react-navigation/native";
import { getCharacterInfo } from "../services/CharacterService";
import { useReaderStore } from "../store/readerStore";
import { generateSpoilerSafeSummary } from "../services/LLMSummaryService";
import { getAllowedText } from "../services/ChapterTextService";
import { loadBook } from "../services/EpubService";

export default function CharacterScreen() {
  const route = useRoute();
  const { name } = route.params as { name: string };
  const { chaptersRead } = useReaderStore();

  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const facts = getCharacterInfo(name, chaptersRead);

  useEffect(() => {
    async function fetchSummary() {
      try {
        setLoading(true);

        // NOTE: Replace with currently opened book URI
        const book = await loadBook("BOOK_URI_HERE");

        const allowedText = await getAllowedText(book, chaptersRead);

        const generated = await generateSpoilerSafeSummary({
          characterName: name,
          allowedText,
        });

        setSummary(generated);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [name]);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>{name}</Text>

      {facts.map((fact, index) => (
        <Text key={index}>• {fact.text}</Text>
      ))}

      <Text style={{ marginTop: 20, fontSize: 18 }}>AI Summary</Text>

      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text>{summary}</Text>
      )}
    </View>
  );
}
