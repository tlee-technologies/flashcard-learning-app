import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
  PanResponder,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { X, RotateCcw, Check, ChevronLeft, ChevronRight } from "lucide-react-native";
import { router } from "expo-router";
import { useStudy } from "@/providers/StudyProvider";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");

export default function StudySessionScreen() {
  const { getDueCards, submitReview } = useStudy();
  const dueCards = getDueCards();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [confidence, setConfidence] = useState(2);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: dueCards.length,
  });

  const flipAnimation = useRef(new Animated.Value(0)).current;
  const progressAnimation = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(1)).current;
  const swipeAnimation = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const currentCard = dueCards[currentIndex];
  const progress = ((currentIndex + 1) / dueCards.length) * 100;

  useEffect(() => {
    Animated.timing(progressAnimation, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        Animated.spring(cardScale, {
          toValue: 0.95,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: swipeAnimation.x, dy: swipeAnimation.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        Animated.spring(cardScale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();

        if (Math.abs(gestureState.dx) > width * 0.3) {
          const isCorrect = gestureState.dx > 0;
          handleSwipe(isCorrect);
        } else {
          Animated.spring(swipeAnimation, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const handleSwipe = (isCorrect: boolean) => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.timing(swipeAnimation.x, {
      toValue: isCorrect ? width * 1.5 : -width * 1.5,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      handleAnswer(isCorrect);
      swipeAnimation.setValue({ x: 0, y: 0 });
    });
  };

  const flipCard = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    Animated.timing(flipAnimation, {
      toValue: showAnswer ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setShowAnswer(!showAnswer);
  };

  const handleAnswer = (isCorrect: boolean) => {
    submitReview(currentCard.id, isCorrect, confidence);
    
    setSessionStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    if (currentIndex < dueCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setConfidence(2);
      flipAnimation.setValue(0);
    } else {
      // Session complete
      router.back();
    }
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const swipeRotation = swipeAnimation.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ["-15deg", "0deg", "15deg"],
  });

  const swipeOpacity = swipeAnimation.x.interpolate({
    inputRange: [-width * 0.5, 0, width * 0.5],
    outputRange: [0.5, 1, 0.5],
  });

  if (!currentCard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cards due for review!</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#EEF2FF", "#F9FAFB"]}
        style={StyleSheet.absoluteFillObject}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <X size={24} color="#6B7280" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                {
                  width: progressAnimation.interpolate({
                    inputRange: [0, 100],
                    outputRange: ["0%", "100%"],
                  }),
                },
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentIndex + 1} / {dueCards.length}
          </Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.card,
            {
              transform: [
                { translateX: swipeAnimation.x },
                { translateY: swipeAnimation.y },
                { rotate: swipeRotation },
                { scale: cardScale },
              ],
              opacity: swipeOpacity,
            },
          ]}
        >
          <TouchableOpacity 
            style={styles.cardTouchable}
            onPress={flipCard}
            activeOpacity={0.9}
          >
            {/* Front */}
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardFront,
                {
                  transform: [{ rotateY: frontInterpolate }],
                },
              ]}
            >
              <Text style={styles.topicLabel}>{currentCard.topic}</Text>
              <Text style={styles.cardText}>{currentCard.front}</Text>
              <Text style={styles.tapHint}>Tap to reveal answer</Text>
            </Animated.View>

            {/* Back */}
            <Animated.View
              style={[
                styles.cardFace,
                styles.cardBack,
                {
                  transform: [{ rotateY: backInterpolate }],
                },
              ]}
            >
              <Text style={styles.answerLabel}>Answer</Text>
              <Text style={styles.cardText}>{currentCard.back}</Text>
              {currentCard.notes && (
                <Text style={styles.notesText}>{currentCard.notes}</Text>
              )}
            </Animated.View>
          </TouchableOpacity>
        </Animated.View>

        {/* Swipe Hints */}
        <View style={styles.swipeHints}>
          <View style={styles.swipeHint}>
            <ChevronLeft size={20} color="#EF4444" />
            <Text style={[styles.swipeHintText, { color: "#EF4444" }]}>
              Incorrect
            </Text>
          </View>
          <View style={styles.swipeHint}>
            <Text style={[styles.swipeHintText, { color: "#10B981" }]}>
              Correct
            </Text>
            <ChevronRight size={20} color="#10B981" />
          </View>
        </View>
      </View>

      {/* Confidence Selector */}
      {showAnswer && (
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>How confident were you?</Text>
          <View style={styles.confidenceButtons}>
            {[1, 2, 3, 4].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.confidenceButton,
                  confidence === level && styles.confidenceButtonActive,
                ]}
                onPress={() => setConfidence(level)}
              >
                <Text
                  style={[
                    styles.confidenceButtonText,
                    confidence === level && styles.confidenceButtonTextActive,
                  ]}
                >
                  {level === 1 ? "None" : level === 2 ? "Low" : level === 3 ? "Good" : "Perfect"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.incorrectButton]}
          onPress={() => handleAnswer(false)}
        >
          <RotateCcw size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Again</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.correctButton]}
          onPress={() => handleAnswer(true)}
        >
          <Check size={24} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Got it</Text>
        </TouchableOpacity>
      </View>

      {/* Session Stats */}
      <View style={styles.sessionStats}>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: "#10B981" }]} />
          <Text style={styles.statText}>{sessionStats.correct} Correct</Text>
        </View>
        <View style={styles.statItem}>
          <View style={[styles.statDot, { backgroundColor: "#EF4444" }]} />
          <Text style={styles.statText}>{sessionStats.incorrect} Incorrect</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  card: {
    width: width - 40,
    height: height * 0.5,
    maxHeight: 400,
  },
  cardTouchable: {
    flex: 1,
  },
  cardFace: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    backgroundColor: "#F0F9FF",
  },
  topicLabel: {
    position: "absolute",
    top: 24,
    left: 24,
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  answerLabel: {
    position: "absolute",
    top: 24,
    left: 24,
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  notesText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 16,
    fontStyle: "italic",
  },
  tapHint: {
    position: "absolute",
    bottom: 24,
    fontSize: 14,
    color: "#9CA3AF",
  },
  swipeHints: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 40,
  },
  swipeHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  swipeHintText: {
    fontSize: 12,
    fontWeight: "500",
  },
  confidenceContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  confidenceLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    marginBottom: 12,
  },
  confidenceButtons: {
    flexDirection: "row",
    gap: 8,
  },
  confidenceButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
  },
  confidenceButtonActive: {
    backgroundColor: "#6366F1",
  },
  confidenceButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
  },
  confidenceButtonTextActive: {
    color: "#FFFFFF",
  },
  actions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  incorrectButton: {
    backgroundColor: "#EF4444",
  },
  correctButton: {
    backgroundColor: "#10B981",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  sessionStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingBottom: 20,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 14,
    color: "#6B7280",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#6B7280",
    marginBottom: 20,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#6366F1",
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});