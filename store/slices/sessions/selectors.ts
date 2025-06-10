import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '~/store'

// 1. Base selector: get entire sessions slice
export const selectSessionsState = (state: RootState) => state.sessions

// 2. Select all sessions as an array
export const selectSessions = createSelector(selectSessionsState, sessionsState =>
  Object.values(sessionsState.sessions),
)

// 3. Select a single session by ID or active session (no ID provided)
export const selectSession = (sessionId?: string) =>
  createSelector(selectSessionsState, sessionsState => {
    if (!sessionId) {
      sessionId = sessionsState.activeSession?.id
    }
    if (!sessionId) return null
    return sessionsState.sessions[sessionId] || null
  })

// Most recent suggestion for a given session or active session (no ID provided)
export const selectMostRecentSuggestion = (sessionId?: string) =>
  createSelector(
    selectSessionsState, // or selectSessionsState if you already have that
    sessionsState => {
      if (!sessionId) {
        sessionId = sessionsState.activeSession?.id
      }
      if (!sessionId) return null
      const session = sessionsState.sessions[sessionId]
      if (!session) return null

      const { suggestions } = session
      if (!suggestions || suggestions.length === 0) return null

      // Return the suggestion with the most recent timestamp
      return suggestions.reduce((mostRecent, suggestion) => {
        const mostRecentTimestamp = mostRecent.endTime || mostRecent.startTime
        const suggestionTimestamp = suggestion.endTime || suggestion.startTime
        if ((!mostRecentTimestamp && suggestionTimestamp) || (suggestionTimestamp && mostRecentTimestamp && suggestionTimestamp > mostRecentTimestamp)) {
          return suggestion
        }
        return mostRecent
      })
    },
  )
