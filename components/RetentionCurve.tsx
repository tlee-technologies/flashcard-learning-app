import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Svg, { Path, Line, Text as SvgText } from "react-native-svg";

const { width } = Dimensions.get("window");
const chartWidth = width - 80;
const chartHeight = 200;

export default function RetentionCurve() {
  // Mock retention data
  const data = [
    { day: 0, retention: 100 },
    { day: 1, retention: 85 },
    { day: 3, retention: 75 },
    { day: 7, retention: 70 },
    { day: 14, retention: 65 },
    { day: 30, retention: 60 },
  ];

  const maxDay = 30;
  const maxRetention = 100;

  const getX = (day: number) => (day / maxDay) * chartWidth;
  const getY = (retention: number) => chartHeight - (retention / maxRetention) * chartHeight;

  const pathData = data
    .map((point, index) => {
      const x = getX(point.day);
      const y = getY(point.retention);
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <View style={styles.container}>
      <Svg width={chartWidth} height={chartHeight + 40}>
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((retention) => (
          <Line
            key={retention}
            x1={0}
            y1={getY(retention)}
            x2={chartWidth}
            y2={getY(retention)}
            stroke="#E5E7EB"
            strokeWidth={1}
          />
        ))}

        {/* Curve */}
        <Path
          d={pathData}
          stroke="#6366F1"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {data.map((point) => (
          <React.Fragment key={point.day}>
            <Line
              x1={getX(point.day)}
              y1={getY(point.retention)}
              x2={getX(point.day)}
              y2={chartHeight}
              stroke="#E5E7EB"
              strokeWidth={1}
              strokeDasharray="3 3"
            />
            <SvgText
              x={getX(point.day)}
              y={chartHeight + 20}
              fontSize={10}
              fill="#6B7280"
              textAnchor="middle"
            >
              {point.day}d
            </SvgText>
          </React.Fragment>
        ))}

        {/* Y-axis labels */}
        {[0, 50, 100].map((retention) => (
          <SvgText
            key={retention}
            x={-10}
            y={getY(retention) + 4}
            fontSize={10}
            fill="#6B7280"
            textAnchor="end"
          >
            {retention}%
          </SvgText>
        ))}
      </Svg>

      <View style={styles.info}>
        <Text style={styles.infoText}>
          Your retention rate shows how well you remember cards over time
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  info: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  infoText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});