import React from 'react';
import { Stack } from 'expo-router';

export default function NewOrderLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="step-two" />
      <Stack.Screen name="step-three" />
    </Stack>
  );
}
