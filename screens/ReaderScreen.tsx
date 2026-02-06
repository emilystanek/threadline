
import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ClickableText from "../components/ClickableText";
import { useReaderStore } from "../store/readerStore";

export default function ReaderScreen() {
  const navigation = useNavigation();
  const [chapterText, setChapterText] = useState("");
  const { currentChapter } = useReaderStore();

  useEffect(() => {
    // Replace with EPUB chapter loader
    setChapterText(
      "Alice walked through the forest and later met Bob near the river."
    );
  }, [currentChapter]);

  function handleCharacterPress(name: string) {
    navigation.navigate("Character" as never, { name } as never);
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <ScrollView>
        <ClickableText
          content={chapterText}
          onCharacterPress={handleCharacterPress}
        />
      </ScrollView>
    </View>
  );
}
