import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TrendingUp, Brain, Target, Clock, Award, Zap } from "lucide-react-native";
import { useStudy } from "@/providers/StudyProvider";
import CircularProgress from "@/components/CircularProgress";
import RetentionCurve from "@/components/RetentionCurve";
import StudyTimeChart from "@/components/StudyTimeChart";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const { getAnalytics, getProgress } = useStudy();
  const analytics = getAnalytics();
  const progress = getProgress();

  const stats = [
    {
      icon: <Brain size={24} color="#6366F1" />,
      label: "Cards Studied",
      value: analytics.totalReviews.toString(),
      change: "+12%",
      positive: true,
    },
    {
      icon: <Target size={24} color="#10B981" />,
      label: "Accuracy Rate",
      value: `${analytics.accuracy}%`,
      change: "+5%",
      positive: true,
    },
    {
      icon: <Clock size={24} color="#F59E0B" />,
      label: "Study Time",
      value: `${analytics.studyTime}m`,
      change: "+18m",
      positive: true,
    },
    {
      icon: <Award size={24} color="#8B5CF6" />,
      label: "Current Streak",
      value: `${analytics.currentStreak}d`,
      change: "Keep it up!",
      positive: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overall Progress */}
        <View style={styles.overallProgress}>
          <Text style={styles.sectionTitle}>Overall Mastery</Text>
          <View style={styles.progressCard}>
            <CircularProgress 
              percentage={progress.masteryPercentage} 
              size={140}
              strokeWidth={14}
              color="#6366F1"
            />
            <View style={styles.progressDetails}>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: "#10B981" }]} />
                <Text style={styles.progressLabel}>Mastered</Text>
                <Text style={styles.progressValue}>{progress.mastered}</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: "#F59E0B" }]} />
                <Text style={styles.progressLabel}>Learning</Text>
                <Text style={styles.progressValue}>{progress.learning}</Text>
              </View>
              <View style={styles.progressItem}>
                <View style={[styles.progressDot, { backgroundColor: "#EF4444" }]} />
                <Text style={styles.progressLabel}>New</Text>
                <Text style={styles.progressValue}>{progress.new}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statIcon}>{stat.icon}</View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <View style={styles.statChange}>
                <TrendingUp size={12} color={stat.positive ? "#10B981" : "#EF4444"} />
                <Text style={[
                  styles.statChangeText,
                  { color: stat.positive ? "#10B981" : "#EF4444" }
                ]}>
                  {stat.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Retention Curve */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Retention Curve</Text>
            <Zap size={20} color="#6B7280" />
          </View>
          <RetentionCurve />
        </View>

        {/* Study Time Distribution */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Study Time Distribution</Text>
          <StudyTimeChart />
        </View>

        {/* Topic Breakdown */}
        <View style={styles.topicBreakdown}>
          <Text style={styles.sectionTitle}>Topic Performance</Text>
          {progress.topics.map((topic, index) => (
            <View key={index} style={styles.topicRow}>
              <View style={styles.topicInfo}>
                <Text style={styles.topicName}>{topic.name}</Text>
                <Text style={styles.topicStats}>
                  {topic.mastered}/{topic.total} mastered
                </Text>
              </View>
              <View style={styles.topicProgress}>
                <Text style={styles.topicPercentage}>{topic.mastery}%</Text>
                <View style={styles.topicBar}>
                  <View 
                    style={[
                      styles.topicBarFill,
                      { 
                        width: `${topic.mastery}%`,
                        backgroundColor: topic.mastery >= 80 ? "#10B981" : 
                                       topic.mastery >= 40 ? "#F59E0B" : "#EF4444"
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  overallProgress: {
    paddingHorizontal: 20,
    paddingTop: 20,
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
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
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
  progressDetails: {
    gap: 16,
  },
  progressItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressLabel: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
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
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  statChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statChangeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  chartSection: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  topicBreakdown: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  topicRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  topicStats: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  topicProgress: {
    alignItems: "flex-end",
  },
  topicPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  topicBar: {
    width: 100,
    height: 6,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
    overflow: "hidden",
  },
  topicBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});