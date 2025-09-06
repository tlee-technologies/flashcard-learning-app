import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

interface User {
  id: string;
  name: string;
  email: string;
  settings: {
    notifications: boolean;
    reminderTime: string;
    cardsPerSession: number;
    soundEffects: boolean;
  };
}

export const [UserProvider, useUser] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Create default user
        const defaultUser: User = {
          id: "user-1",
          name: "Learner",
          email: "learner@example.com",
          settings: {
            notifications: true,
            reminderTime: "20:00",
            cardsPerSession: 20,
            soundEffects: true,
          },
        };
        setUser(defaultUser);
        await AsyncStorage.setItem("user", JSON.stringify(defaultUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return;
    
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateSettings = async (settings: Partial<User["settings"]>) => {
    if (!user) return;
    
    const updatedUser = {
      ...user,
      settings: { ...user.settings, ...settings },
    };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
  };

  return {
    user,
    isLoading,
    updateUser,
    updateSettings,
  };
});