import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default function StudyTimeChart() {
  // Mock data for last 7 days
  const data = [
    { day: "Mon", minutes: 15 },
    { day: "Tue", minutes: 25 },
    { day: "Wed", minutes: 20 },
    { day: "Thu", minutes: 30 },
    { day: "Fri", minutes: 10 },
    { day: "Sat", minutes: 35 },
    { day: "Sun", minutes: 25 },
  ];

  const maxMinutes = Math.max(...data.map(d => d.minutes));
  const barWidth = (width - 80) / data.length - 12;

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        {data.map((item, index) => (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <View
                style={[
                  styles.bar,
                  {
                    height: (item.minutes / maxMinutes) * 120,
                    width: barWidth,
                  },
                ]}
              />
              <Text style={styles.barValue}>{item.minutes}m</Text>
            </View>
            <Text style={styles.barLabel}>{item.day}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>160</Text>
          <Text style={styles.summaryLabel}>Total minutes</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>23</Text>
          <Text style={styles.summaryLabel}>Daily average</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
  },
  chart: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 150,
    marginBottom: 20,
  },
  barContainer: {
    alignItems: "center",
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: 120,
  },
  bar: {
    backgroundColor: "#6366F1",
    borderRadius: 4,
    marginBottom: 4,
  },
  barValue: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 4,
  },
  barLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
  },
  summary: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    gap: 24,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E5E7EB",
  },
});