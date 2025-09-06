import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Filter, Plus, BookOpen, Clock, CheckCircle } from "lucide-react-native";
import { router } from "expo-router";
import { useStudy } from "@/providers/StudyProvider";

export default function CardsScreen() {
  const { cards } = useStudy();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const topics = useMemo(() => {
    const topicSet = new Set(cards.map(card => card.topic));
    return Array.from(topicSet);
  }, [cards]);

  const filteredCards = useMemo(() => {
    let filtered = cards;
    
    if (searchQuery) {
      filtered = filtered.filter(card => 
        card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.back.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (selectedTopic) {
      filtered = filtered.filter(card => card.topic === selectedTopic);
    }
    
    return filtered;
  }, [cards, searchQuery, selectedTopic]);

  const getMasteryIcon = (mastery: number) => {
    if (mastery >= 80) return <CheckCircle size={20} color="#10B981" />;
    if (mastery >= 40) return <Clock size={20} color="#F59E0B" />;
    return <BookOpen size={20} color="#6B7280" />;
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return "#10B981";
    if (mastery >= 40) return "#F59E0B";
    return "#6B7280";
  };

  const renderCard = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push({
        pathname: "../card-editor" as any,
        params: { cardId: item.id }
      })}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardTopic}>
          <Text style={styles.topicLabel}>{item.topic}</Text>
        </View>
        {getMasteryIcon(item.mastery)}
      </View>
      
      <Text style={styles.cardFront} numberOfLines={2}>
        {item.front}
      </Text>
      
      <Text style={styles.cardBack} numberOfLines={2}>
        {item.back}
      </Text>
      
      <View style={styles.cardFooter}>
        <View style={styles.masteryBar}>
          <View 
            style={[
              styles.masteryFill, 
              { 
                width: `${item.mastery}%`,
                backgroundColor: getMasteryColor(item.mastery)
              }
            ]} 
          />
        </View>
        <Text style={styles.masteryText}>{item.mastery}%</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search cards..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Topic Filters */}
      <View style={styles.topicsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["All", ...topics]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.topicChip,
                (selectedTopic === item || (item === "All" && !selectedTopic)) && 
                styles.topicChipActive
              ]}
              onPress={() => setSelectedTopic(item === "All" ? null : item)}
            >
              <Text style={[
                styles.topicChipText,
                (selectedTopic === item || (item === "All" && !selectedTopic)) && 
                styles.topicChipTextActive
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.topicsList}
        />
      </View>

      {/* Cards List */}
      <FlatList
        data={filteredCards}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        contentContainerStyle={styles.cardsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <BookOpen size={48} color="#D1D5DB" />
            <Text style={styles.emptyText}>No cards found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        }
      />

      {/* Add Card FAB */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => router.push("../card-editor" as any)}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  topicsContainer: {
    paddingBottom: 12,
  },
  topicsList: {
    paddingHorizontal: 20,
    gap: 8,
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
  cardsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardTopic: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  topicLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
  },
  cardFront: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardBack: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  masteryBar: {
    flex: 1,
    height: 4,
    backgroundColor: "#F3F4F6",
    borderRadius: 2,
    overflow: "hidden",
  },
  masteryFill: {
    height: "100%",
    borderRadius: 2,
  },
  masteryText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    backgroundColor: "#6366F1",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});