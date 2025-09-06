import React, { useState, useEffect, useCallback, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { finiteAutomataCards } from "@/data/cards";
import { spacedRepetition } from "@/utils/spacedRepetition";

interface Card {
  id: string;
  front: string;
  back: string;
  topic: string;
  notes?: string;
  difficulty: number;
  mastery: number;
  nextReview: Date;
  interval: number;
  easeFactor: number;
  reviewCount: number;
  correctCount: number;
  lastReviewed?: Date;
}

interface ReviewLog {
  cardId: string;
  timestamp: Date;
  correct: boolean;
  confidence: number;
  timeSpent: number;
}

interface StudySession {
  id: string;
  date: Date;
  cardsReviewed: number;
  correctAnswers: number;
  duration: number;
}

export const [StudyProvider, useStudy] = createContextHook(() => {
  const [cards, setCards] = useState<Card[]>([]);
  const [reviewLogs, setReviewLogs] = useState<ReviewLog[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from AsyncStorage
  useEffect(() => {
    console.log("StudyProvider: Starting to load data");
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [storedCards, storedLogs, storedSessions] = await Promise.all([
        AsyncStorage.getItem("cards"),
        AsyncStorage.getItem("reviewLogs"),
        AsyncStorage.getItem("sessions"),
      ]);

      if (storedCards) {
        const parsedCards = JSON.parse(storedCards);
        setCards(parsedCards.map((c: any) => ({
          ...c,
          nextReview: new Date(c.nextReview),
          lastReviewed: c.lastReviewed ? new Date(c.lastReviewed) : undefined,
        })));
      } else {
        // Initialize with default cards
        const initialCards = finiteAutomataCards.map((card, index) => ({
          ...card,
          id: `card-${index}`,
          difficulty: 1,
          mastery: 0,
          nextReview: new Date(),
          interval: 1,
          easeFactor: 2.5,
          reviewCount: 0,
          correctCount: 0,
        }));
        setCards(initialCards);
        await AsyncStorage.setItem("cards", JSON.stringify(initialCards));
      }

      if (storedLogs) {
        const parsedLogs = JSON.parse(storedLogs);
        setReviewLogs(parsedLogs.map((l: any) => ({
          ...l,
          timestamp: new Date(l.timestamp),
        })));
      }

      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions);
        setSessions(parsedSessions.map((s: any) => ({
          ...s,
          date: new Date(s.date),
        })));
      }
    } catch (error) {
      console.error("StudyProvider: Error loading data:", error);
    } finally {
      console.log("StudyProvider: Data loaded, cards count:", cards.length);
      setIsLoading(false);
    }
  };

  const saveCards = async (updatedCards: Card[]) => {
    setCards(updatedCards);
    await AsyncStorage.setItem("cards", JSON.stringify(updatedCards));
  };

  const saveLogs = async (updatedLogs: ReviewLog[]) => {
    setReviewLogs(updatedLogs);
    await AsyncStorage.setItem("reviewLogs", JSON.stringify(updatedLogs));
  };

  const saveSessions = async (updatedSessions: StudySession[]) => {
    setSessions(updatedSessions);
    await AsyncStorage.setItem("sessions", JSON.stringify(updatedSessions));
  };

  // Get cards due for review
  const getDueCards = useCallback(() => {
    const now = new Date();
    return cards.filter(card => card.nextReview <= now);
  }, [cards]);

  // Submit a review
  const submitReview = useCallback(async (
    cardId: string,
    correct: boolean,
    confidence: number
  ) => {
    const card = cards.find(c => c.id === cardId);
    if (!card) return;

    const { interval, easeFactor, nextReview } = spacedRepetition(
      card.interval,
      card.easeFactor,
      correct,
      confidence
    );

    const updatedCard = {
      ...card,
      interval,
      easeFactor,
      nextReview,
      reviewCount: card.reviewCount + 1,
      correctCount: card.correctCount + (correct ? 1 : 0),
      mastery: Math.min(100, Math.round((card.correctCount + (correct ? 1 : 0)) / (card.reviewCount + 1) * 100)),
      lastReviewed: new Date(),
    };

    const updatedCards = cards.map(c => c.id === cardId ? updatedCard : c);
    await saveCards(updatedCards);

    // Log the review
    const log: ReviewLog = {
      cardId,
      timestamp: new Date(),
      correct,
      confidence,
      timeSpent: 0, // Would be calculated from actual time
    };
    await saveLogs([...reviewLogs, log]);
  }, [cards, reviewLogs]);

  // Add a new card
  const addCard = useCallback(async (cardData: Omit<Card, "id" | "mastery" | "nextReview" | "interval" | "easeFactor" | "reviewCount" | "correctCount">) => {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
      mastery: 0,
      nextReview: new Date(),
      interval: 1,
      easeFactor: 2.5,
      reviewCount: 0,
      correctCount: 0,
    };
    await saveCards([...cards, newCard]);
  }, [cards]);

  // Update a card
  const updateCard = useCallback(async (cardId: string, updates: Partial<Card>) => {
    const updatedCards = cards.map(c => c.id === cardId ? { ...c, ...updates } : c);
    await saveCards(updatedCards);
  }, [cards]);

  // Get progress statistics
  const getProgress = useCallback(() => {
    const totalCards = cards.length;
    const mastered = cards.filter(c => c.mastery >= 80).length;
    const learning = cards.filter(c => c.mastery > 0 && c.mastery < 80).length;
    const newCards = cards.filter(c => c.reviewCount === 0).length;

    const topics = Array.from(new Set(cards.map(c => c.topic))).map(topic => {
      const topicCards = cards.filter(c => c.topic === topic);
      const topicMastered = topicCards.filter(c => c.mastery >= 80).length;
      return {
        name: topic,
        total: topicCards.length,
        mastered: topicMastered,
        mastery: Math.round((topicMastered / topicCards.length) * 100),
      };
    });

    return {
      totalCards,
      mastered,
      learning,
      new: newCards,
      masteryPercentage: Math.round((mastered / totalCards) * 100),
      topics,
    };
  }, [cards]);

  // Get analytics
  const getAnalytics = useCallback(() => {
    const today = new Date();
    const last30Days = reviewLogs.filter(log => {
      const daysDiff = (today.getTime() - log.timestamp.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 30;
    });

    const totalReviews = last30Days.length;
    const correctReviews = last30Days.filter(l => l.correct).length;
    const accuracy = totalReviews > 0 ? Math.round((correctReviews / totalReviews) * 100) : 0;

    // Calculate study time (mock data for now)
    const studyTime = Math.round(totalReviews * 0.5); // 30 seconds per card average

    // Calculate streak
    const currentStreak = calculateStreak();

    return {
      totalReviews,
      correctReviews,
      accuracy,
      studyTime,
      currentStreak,
    };
  }, [reviewLogs]);

  // Calculate study streak
  const calculateStreak = useCallback(() => {
    if (sessions.length === 0) return 0;

    const sortedSessions = [...sessions].sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const session of sortedSessions) {
      const sessionDate = new Date(session.date);
      sessionDate.setHours(0, 0, 0, 0);

      const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak) {
        break;
      }
    }

    return streak;
  }, [sessions]);

  const getStreak = useCallback(() => calculateStreak(), [calculateStreak]);

  // Get activity data for heatmap
  const getActivityData = useCallback(() => {
    const activityMap = new Map<string, number>();
    
    reviewLogs.forEach(log => {
      const dateKey = log.timestamp.toISOString().split("T")[0];
      activityMap.set(dateKey, (activityMap.get(dateKey) || 0) + 1);
    });

    return Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }, [reviewLogs]);

  return {
    cards,
    reviewLogs,
    sessions,
    isLoading,
    getDueCards,
    submitReview,
    addCard,
    updateCard,
    getProgress,
    getAnalytics,
    getStreak,
    getActivityData,
  };
});