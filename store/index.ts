import AsyncStorage from '@react-native-async-storage/async-storage'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import { configureStore } from '@reduxjs/toolkit'
import sessionsReducer from './slices/sessions'

const sessionsPersistConfig = {
  key: 'sessions',
  storage: AsyncStorage,
}

const persistedSessionsReducer = persistReducer(sessionsPersistConfig, sessionsReducer)

export const store = configureStore({
  reducer: {
    sessions: persistedSessionsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
