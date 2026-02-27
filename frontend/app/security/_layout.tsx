import { Stack } from "expo-router";

export default function SecurityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Security Menu",
      }}
    />
  );
}
