import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, Trophy, Target, Clock, TrendingUp, Calendar } from "lucide-react-native";
import { router } from "expo-router";
import { useStudy } from "@/providers/StudyProvider";
import { useUser } from "@/providers/UserProvider";
import CircularProgress from "@/components/CircularProgress";
import ActivityHeatmap from "@/components/ActivityHeatmap";
import QuickStats from "@/components/QuickStats";

const { width } = Dimensions.get("window");

export default function DashboardScreen() {
  try {
    const { getDueCards, getProgress, getStreak, isLoading: studyLoading } = useStudy();
    const { user, isLoading: userLoading } = useUser();
    
    // Show loading state while data is being loaded
    if (studyLoading || userLoading) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading your study data...</Text>
          </View>
        </SafeAreaView>
      );
    }
    
    const dueCards = getDueCards();
    const progress = getProgress();
    const streak = getStreak();

  const startStudySession = () => {
    if (dueCards.length > 0) {
      router.push("../study-session" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{user?.name || "Learner"}</Text>
          </View>
          <View style={styles.streakBadge}>
            <Trophy size={20} color="#F59E0B" />
            <Text style={styles.streakText}>{streak} day streak</Text>
          </View>
        </View>

        {/* Study Button */}
        <TouchableOpacity 
          style={styles.studyButton}
          onPress={startStudySession}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={dueCards.length > 0 ? ["#6366F1", "#8B5CF6"] : ["#9CA3AF", "#6B7280"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.studyButtonGradient}
          >
            <View style={styles.studyButtonContent}>
              <Play size={32} color="#FFFFFF" />
              <View style={styles.studyButtonText}>
                <Text style={styles.studyButtonTitle}>
                  {dueCards.length > 0 ? "Start Study Session" : "All Caught Up!"}
                </Text>
                <Text style={styles.studyButtonSubtitle}>
                  {dueCards.length > 0 
                    ? `${dueCards.length} cards due for review`
                    : "Check back tomorrow"}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Progress Overview */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>Your Progress</Text>
          <View style={styles.progressCard}>
            <CircularProgress 
              percentage={progress.masteryPercentage} 
              size={120}
              strokeWidth={12}
              color="#6366F1"
            />
            <View style={styles.progressStats}>
              <View style={styles.statItem}>
                <Target size={20} color="#6366F1" />
                <Text style={styles.statValue}>{progress.totalCards}</Text>
                <Text style={styles.statLabel}>Total Cards</Text>
              </View>
              <View style={styles.statItem}>
                <TrendingUp size={20} color="#10B981" />
                <Text style={styles.statValue}>{progress.mastered}</Text>
                <Text style={styles.statLabel}>Mastered</Text>
              </View>
              <View style={styles.statItem}>
                <Clock size={20} color="#F59E0B" />
                <Text style={styles.statValue}>{progress.learning}</Text>
                <Text style={styles.statLabel}>Learning</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats */}
        <QuickStats />

        {/* Activity Heatmap */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <Calendar size={20} color="#6B7280" />
          </View>
          <ActivityHeatmap />
        </View>

        {/* Topics Progress */}
        <View style={styles.topicsSection}>
          <Text style={styles.sectionTitle}>Topics</Text>
          {progress.topics.map((topic, index) => (
            <View key={index} style={styles.topicCard}>
              <View style={styles.topicHeader}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicPercentage}>{topic.mastery}%</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${topic.mastery}%` }
                  ]} 
                />
              </View>
              <Text style={styles.topicStats}>
                {topic.mastered}/{topic.total} cards mastered
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
  } catch (error) {
    console.error("Dashboard error:", error);
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Something went wrong</Text>
          <Text style={styles.errorDetail}>{String(error)}</Text>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: "#6B7280",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
  },
  studyButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#6366F1",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  studyButtonGradient: {
    borderRadius: 20,
    padding: 24,
  },
  studyButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  studyButtonText: {
    flex: 1,
  },
  studyButtonTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  studyButtonSubtitle: {
    fontSize: 14,
    color: "#E0E7FF",
  },
  progressSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 16,
  },
  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
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
  progressStats: {
    flex: 1,
    gap: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  activitySection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topicsSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  topicCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  topicName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  topicPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6366F1",
  },
  progressBar: {
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },
  topicStats: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#EF4444",
    marginBottom: 8,
  },
  errorDetail: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
});