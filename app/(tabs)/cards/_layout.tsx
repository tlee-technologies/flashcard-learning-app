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
    </Stack>
  );
}