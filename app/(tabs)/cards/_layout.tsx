import { Stack } from "expo-router";

export default function CardsLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "Card Library",
          headerLargeTitle: true,
        }} 
      />
      <Stack.Screen 
        name="import" 
        options={{ 
          title: "Import from PDF",
          presentation: "modal"
        }} 
      />
    </Stack>
  );
}