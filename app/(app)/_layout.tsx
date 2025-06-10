import { Stack } from 'expo-router'

export const unstable_settings = {
  initialRouteName: '(tabs)',
}

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={false}>
        <Stack.Screen name={'(tabs)'} />
      </Stack.Protected>
      <Stack.Screen
        name={'(auth)'}
        options={{
          presentation: 'modal',
        }}
      />
    </Stack>
  )
}