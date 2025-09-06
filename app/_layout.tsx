import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StudyProvider } from "@/providers/StudyProvider";
import { UserProvider } from "@/providers/UserProvider";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="study-session" 
        options={{ 
          presentation: "modal",
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="card-editor" 
        options={{ 
          presentation: "modal",
          title: "Edit Card"
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    console.log("Root layout mounted");
    SplashScreen.hideAsync().catch(console.error);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <UserProvider>
          <StudyProvider>
            <RootLayoutNav />
          </StudyProvider>
        </UserProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}