import { useAppDispatch, useAppSelector } from '~/store/hooks'
import { selectSessions, selectSession, selectMostRecentSuggestion } from '~/store/slices/sessions/selectors'
import { endSession, startSession } from '~/store/slices/sessions'
import { v4 as uuidv4 } from 'uuid'
import { useAnalyzeSession } from '~/hooks/useAnalyzeSession'
import { useMemo } from 'react'

export const useSessions = () => {
  return useAppSelector(selectSessions)
}

// Custom hook to get the most recent suggestion for a given session
export const useMostRecentSuggestion = (sessionId?: string) => {
  return useAppSelector(state => selectMostRecentSuggestion(sessionId)(state))
}

export const useSession = (id?: string) => {

  const sessionId = useMemo(() => {
    if (!id) {
      return uuidv4()
    } else {
      return id
    }
  }, [id])

  const analyzer = useAnalyzeSession(sessionId)

  const dispatch = useAppDispatch()
  // Pass a function to useAppSelector so you can pass in the ID
  return {
    data: useAppSelector(state => selectSession(id)(state)),
    start: async () => {
      // Start the session
      await analyzer.start()
      dispatch(startSession({ sessionId }))
    },
    stop: async () => {
      // Stop the session
      await analyzer.stop()
      dispatch(endSession({ sessionId }))
    },
    pause: () => {},
  }
}
