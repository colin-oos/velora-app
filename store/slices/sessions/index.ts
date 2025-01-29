import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Session, TranscriptPart, Suggestion } from './sessionTypes'

interface SessionsState {
  sessions: Record<string, Session> // or Session[] if you prefer
  activeSession: {
    id: string
    paused: boolean
  } | null
}

const initialState: SessionsState = {
  sessions: {},
  activeSession: null,
}

const index = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<{ sessionId: string }>) => {
      const { sessionId } = action.payload

      state.sessions[sessionId] = {
        id: sessionId,
        startTime: new Date(),
        endTime: null,
        transcript: {
          parts: [],
          text: null,
        },
        suggestions: [],
      }
      state.activeSession = {
        id: sessionId,
        paused: true,
      }
    },
    endSession: (state, action: PayloadAction<{ sessionId: string }>) => {
      const { sessionId } = action.payload
      const session = state.sessions[sessionId]
      if (session) {
        session.endTime = new Date()
      }

      // Reset activeSession
      state.activeSession = null
    },
    addTranscriptPart: (state, action: PayloadAction<{ sessionId: string; transcriptPart: TranscriptPart }>) => {
      const { sessionId, transcriptPart } = action.payload
      const session = state.sessions[sessionId]
      if (session && session.transcript) {
        session.transcript.parts.push(transcriptPart)

        if (!session.transcript.text) {
          session.transcript.text = {
            final: '',
            partial: null,
            current: '',
          }
        }

        // Example logic for updating "final" text
        if (!transcriptPart.isPartial && session.transcript.text) {
          session.transcript.text.final += ' ' + transcriptPart.text
        } else if (transcriptPart.isPartial && session.transcript.text) {
          session.transcript.text.partial = transcriptPart.text
        }

        // Update "current" text
        session.transcript.text.current =
          session.transcript.text.final + (session.transcript.text.partial ? ` ${session.transcript.text.partial}` : '')
      }
    },
    addSuggestion: (state, action: PayloadAction<{ sessionId: string; suggestion: Suggestion }>) => {
      const { sessionId, suggestion } = action.payload
      const session = state.sessions[sessionId]
      if (session) {
        session.suggestions.push(suggestion)
      }
    },
  },
})

export const { startSession, endSession, addTranscriptPart, addSuggestion } = index.actions

export default index.reducer
