import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Zap, Target, Brain, TrendingUp } from "lucide-react-native";
import { useStudy } from "@/providers/StudyProvider";

export default function QuickStats() {
  const { getAnalytics } = useStudy();
  const analytics = getAnalytics();

  const stats = [
    {
      icon: <Zap size={16} color="#F59E0B" />,
      label: "Today",
      value: "12",
      unit: "cards",
      color: "#FEF3C7",
    },
    {
      icon: <Target size={16} color="#10B981" />,
      label: "Accuracy",
      value: analytics.accuracy.toString(),
      unit: "%",
      color: "#D1FAE5",
    },
    {
      icon: <Brain size={16} color="#6366F1" />,
      label: "Reviewed",
      value: analytics.totalReviews.toString(),
      unit: "total",
      color: "#EEF2FF",
    },
    {
      icon: <TrendingUp size={16} color="#8B5CF6" />,
      label: "Streak",
      value: analytics.currentStreak.toString(),
      unit: "days",
      color: "#F3E8FF",
    },
  ];

  return (
    <View style={styles.container}>
      {stats.map((stat, index) => (
        <View key={index} style={[styles.stat, { backgroundColor: stat.color }]}>
          {stat.icon}
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {stat.value}
              <Text style={styles.statUnit}> {stat.unit}</Text>
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
    paddingHorizontal: 20,
  },
  stat: {
    flex: 1,
    minWidth: "45%",
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
  },
  statUnit: {
    fontSize: 14,
    fontWeight: "normal",
    color: "#6B7280",
  },
  statLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
});