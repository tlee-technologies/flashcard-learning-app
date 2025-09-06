import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Save, X, Image as ImageIcon, Mic } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useStudy } from "@/providers/StudyProvider";

export default function CardEditorScreen() {
  const { cardId } = useLocalSearchParams();
  const { cards, addCard, updateCard } = useStudy();
  
  const existingCard = cardId ? cards.find(c => c.id === cardId) : null;
  
  const [front, setFront] = useState(existingCard?.front || "");
  const [back, setBack] = useState(existingCard?.back || "");
  const [topic, setTopic] = useState(existingCard?.topic || "Core Definitions");
  const [notes, setNotes] = useState(existingCard?.notes || "");
  const [difficulty, setDifficulty] = useState(existingCard?.difficulty || 1);

  const topics = [
    "Core Definitions",
    "Components",
    "Operations",
    "Languages",
    "Advanced Concepts",
  ];

  const handleSave = () => {
    if (!front.trim() || !back.trim()) return;

    const cardData = {
      front: front.trim(),
      back: back.trim(),
      topic,
      notes: notes.trim(),
      difficulty,
    };

    if (existingCard) {
      updateCard(existingCard.id, cardData);
    } else {
      addCard(cardData);
    }

    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => router.back()}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
            
            <Text style={styles.title}>
              {existingCard ? "Edit Card" : "New Card"}
            </Text>
            
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSave}
              disabled={!front.trim() || !back.trim()}
            >
              <Save size={24} color={front.trim() && back.trim() ? "#6366F1" : "#D1D5DB"} />
            </TouchableOpacity>
          </View>

          {/* Topic Selector */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Topic</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.topicScroll}
            >
              {topics.map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[
                    styles.topicChip,
                    topic === t && styles.topicChipActive,
                  ]}
                  onPress={() => setTopic(t)}
                >
                  <Text
                    style={[
                      styles.topicChipText,
                      topic === t && styles.topicChipTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Front Side */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Question / Front</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter the question or concept..."
                value={front}
                onChangeText={setFront}
                multiline
                numberOfLines={3}
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.inputActions}>
                <TouchableOpacity style={styles.inputAction}>
                  <ImageIcon size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputAction}>
                  <Mic size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Back Side */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Answer / Back</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter the answer or definition..."
                value={back}
                onChangeText={setBack}
                multiline
                numberOfLines={4}
                placeholderTextColor="#9CA3AF"
              />
              <View style={styles.inputActions}>
                <TouchableOpacity style={styles.inputAction}>
                  <ImageIcon size={20} color="#6B7280" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.inputAction}>
                  <Mic size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Personal Notes (Optional)</Text>
            <TextInput
              style={[styles.textInput, styles.notesInput]}
              placeholder="Add mnemonics, examples, or personal notes..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Difficulty */}
          <View style={styles.section}>
            <Text style={styles.sectionLabel}>Difficulty Level</Text>
            <View style={styles.difficultyContainer}>
              {[1, 2, 3].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.difficultyButton,
                    difficulty === level && styles.difficultyButtonActive,
                  ]}
                  onPress={() => setDifficulty(level)}
                >
                  <Text
                    style={[
                      styles.difficultyButtonText,
                      difficulty === level && styles.difficultyButtonTextActive,
                    ]}
                  >
                    {level === 1 ? "Easy" : level === 2 ? "Medium" : "Hard"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Preview Card */}
          {(front || back) && (
            <View style={styles.previewSection}>
              <Text style={styles.sectionLabel}>Preview</Text>
              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View style={styles.previewTopic}>
                    <Text style={styles.previewTopicText}>{topic}</Text>
                  </View>
                </View>
                {front && (
                  <Text style={styles.previewFront}>{front}</Text>
                )}
                {front && back && (
                  <View style={styles.previewDivider} />
                )}
                {back && (
                  <Text style={styles.previewBack}>{back}</Text>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  topicScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  topicChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginRight: 8,
  },
  topicChipActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  topicChipText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  topicChipTextActive: {
    color: "#FFFFFF",
  },
  inputContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  textInput: {
    fontSize: 16,
    color: "#111827",
    lineHeight: 24,
  },
  notesInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
  },
  inputActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
    gap: 12,
  },
  inputAction: {
    width: 36,
    height: 36,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  difficultyContainer: {
    flexDirection: "row",
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  difficultyButtonActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  difficultyButtonTextActive: {
    color: "#FFFFFF",
  },
  previewSection: {
    paddingHorizontal: 20,
    marginTop: 32,
  },
  previewCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  previewHeader: {
    marginBottom: 16,
  },
  previewTopic: {
    alignSelf: "flex-start",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  previewTopicText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  previewFront: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 12,
  },
  previewDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 12,
  },
  previewBack: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
});