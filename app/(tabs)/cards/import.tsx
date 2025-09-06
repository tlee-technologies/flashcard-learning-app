import * as DocumentPicker from "expo-document-picker";
import React, { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from "react-native";
import { useMutation } from "@tanstack/react-query";

import { FileText, Upload, Check } from "lucide-react-native";
import { ingestPdf } from "@/utils/api";
import type { GeneratedCard } from "@/types/ingest";

export default function ImportScreen() {
  const [cards, setCards] = useState<GeneratedCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  
  const mut = useMutation({ 
    mutationFn: ingestPdf, 
    onSuccess: (data) => {
      setCards(data.cards);
      setSelectedCards(new Set(data.cards.map(c => c.id)));
    },
    onError: (error) => {
      Alert.alert("Error", `Failed to process PDF: ${error.message}`);
    }
  });

  async function pickFile() {
    try {
      const r = await DocumentPicker.getDocumentAsync({ 
        type: "application/pdf", 
        multiple: false 
      });
      
      if (r.canceled || !r.assets?.length) return;
      
      const f = r.assets[0];
      mut.mutate({ 
        name: f.name ?? "doc.pdf", 
        uri: f.uri, 
        mimeType: f.mimeType ?? "application/pdf" 
      });
    } catch {
      Alert.alert("Error", "Failed to pick file");
    }
  }

  function toggleCard(cardId: string) {
    const newSelected = new Set(selectedCards);
    if (newSelected.has(cardId)) {
      newSelected.delete(cardId);
    } else {
      newSelected.add(cardId);
    }
    setSelectedCards(newSelected);
  }

  function saveToDeck() {
    const selected = cards.filter(c => selectedCards.has(c.id));
    Alert.alert(
      "Save Cards", 
      `Save ${selected.length} cards to deck?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Save", 
          onPress: () => {
            // TODO: Implement actual save to deck functionality
            Alert.alert("Success", `${selected.length} cards saved to deck!`);
            setCards([]);
            setSelectedCards(new Set());
          }
        }
      ]
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable 
          onPress={pickFile} 
          style={[styles.uploadButton, mut.isPending && styles.uploadButtonDisabled]}
          disabled={mut.isPending}
        >
          <Upload size={20} color="#FFFFFF" />
          <Text style={styles.uploadButtonText}>
            {mut.isPending ? "Processing PDF..." : "Choose PDF to Generate Cards"}
          </Text>
        </Pressable>
        
        {cards.length > 0 && (
          <View style={styles.stats}>
            <Text style={styles.statsText}>
              {cards.length} cards generated • {selectedCards.size} selected
            </Text>
            <Pressable 
              onPress={saveToDeck}
              style={[styles.saveButton, selectedCards.size === 0 && styles.saveButtonDisabled]}
              disabled={selectedCards.size === 0}
            >
              <Text style={styles.saveButtonText}>Save to Deck</Text>
            </Pressable>
          </View>
        )}
      </View>

      <ScrollView style={styles.cardsList} showsVerticalScrollIndicator={false}>
        {cards.map(card => {
          const isSelected = selectedCards.has(card.id);
          return (
            <Pressable 
              key={card.id} 
              style={[styles.cardItem, isSelected && styles.cardItemSelected]}
              onPress={() => toggleCard(card.id)}
            >
              <View style={styles.cardHeader}>
                <FileText size={16} color={isSelected ? "#6366F1" : "#6B7280"} />
                <View style={styles.cardTopics}>
                  {card.topics.map(topic => (
                    <Text key={topic} style={[styles.topicTag, isSelected && styles.topicTagSelected]}>
                      {topic}
                    </Text>
                  ))}
                </View>
                {isSelected && <Check size={16} color="#6366F1" />}
              </View>
              
              <Text style={[styles.cardFront, isSelected && styles.cardFrontSelected]}>
                {card.front}
              </Text>
              
              <Text style={[styles.cardBack, isSelected && styles.cardBackSelected]}>
                {card.back}
              </Text>
              
              <View style={styles.cardMeta}>
                <Text style={styles.cardMetaText}>
                  Tags: {card.tags.join(", ")} • Confidence: {(card.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  uploadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  statsText: {
    fontSize: 14,
    color: "#6B7280",
  },
  saveButton: {
    backgroundColor: "#10B981",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  cardsList: {
    flex: 1,
    padding: 16,
  },
  cardItem: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cardItemSelected: {
    borderColor: "#6366F1",
    backgroundColor: "#F8FAFF",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cardTopics: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  topicTag: {
    fontSize: 12,
    color: "#6B7280",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  topicTagSelected: {
    backgroundColor: "#EEF2FF",
    color: "#6366F1",
  },
  cardFront: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardFrontSelected: {
    color: "#6366F1",
  },
  cardBack: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  cardBackSelected: {
    color: "#4B5563",
  },
  cardMeta: {
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 8,
  },
  cardMetaText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});