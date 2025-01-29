import { Stack } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '~/store'
import 'react-native-get-random-values'


export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <GestureHandlerRootView>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name={'(tabs)'} />
          </Stack>
        </GestureHandlerRootView>
      </PersistGate>
    </Provider>
  )
}
