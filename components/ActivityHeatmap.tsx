import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useStudy } from "@/providers/StudyProvider";

export default function ActivityHeatmap() {
  const { getActivityData } = useStudy();
  const activityData = getActivityData();

  // Generate last 90 days
  const days = [];
  const today = new Date();
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const activity = activityData.find(a => a.date === dateStr);
    days.push({
      date: dateStr,
      count: activity?.count || 0,
      day: date.getDay(),
    });
  }

  // Group by weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const getColor = (count: number) => {
    if (count === 0) return "#F3F4F6";
    if (count <= 2) return "#C7D2FE";
    if (count <= 5) return "#A5B4FC";
    if (count <= 10) return "#818CF8";
    return "#6366F1";
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
      >
        <View style={styles.heatmap}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.day,
                    { backgroundColor: getColor(day.count) },
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        <View style={styles.legendColors}>
          {[0, 2, 5, 10, 15].map((count, index) => (
            <View
              key={index}
              style={[styles.legendColor, { backgroundColor: getColor(count) }]}
            />
          ))}
        </View>
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
  },
  scrollView: {
    marginBottom: 12,
  },
  heatmap: {
    flexDirection: "row",
    gap: 3,
  },
  week: {
    gap: 3,
  },
  day: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legend: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  legendText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
  legendColors: {
    flexDirection: "row",
    gap: 3,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});