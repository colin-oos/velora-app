import { useAppDispatch, useAppSelector } from '~/store/hooks'
import { selectSessions, selectSession, selectMostRecentSuggestion } from '~/store/slices/sessions/selectors'
import { endSession, startSession } from '~/store/slices/sessions'
import { v4 as uuidv4 } from 'uuid'
import { useAnalyzeSession } from '~/hooks/useAnalyzeSession'
import { useMemo } from 'react'
import { Bookmark } from '~/lib/icons/Bookmark'
import { BookOpenText } from '~/lib/icons/BookOpenText'
import { Quote } from '~/lib/icons/Quote'
import { Lightbulb } from '~/lib/icons/Lightbulb'

export const useSessions = () => {
  return useAppSelector(selectSessions)
}

// Custom hook to get the most recent suggestion for a given session
export const useMostRecentSuggestion = (sessionId?: string) => {
  const suggestion = useAppSelector(state => selectMostRecentSuggestion(sessionId)(state))

  const passage = useMemo(() => {
    let passageString: undefined | string = undefined
    if (suggestion?.range) {
      const { start, end } = suggestion.range
      if (start.book === end.book) {
        if (start.chapter === end.chapter) {
          passageString = `${start.book} ${start.chapter}:${start.verse}-${end.verse}`
        } else {
          passageString = `${start.book} ${start.chapter}:${start.verse}-${end.chapter}:${end.verse}`
        }
      } else {
        passageString = `${start.book} ${start.chapter}:${start.verse}-${end.book} ${end.chapter}:${end.verse}`
      }
    } else if (suggestion) {
      if (suggestion.book && suggestion.chapter && suggestion.verse) {
        passageString = `${suggestion.book} ${suggestion.chapter}:${suggestion.verse}`
      } else if (suggestion.book && suggestion.chapter) {
        passageString = `${suggestion.book} ${suggestion.chapter}`
      } else if (suggestion.book) {
        passageString = suggestion.book
      }
    }
    return passageString
  }, [suggestion?.book, suggestion?.chapter, suggestion?.verse, suggestion?.range?.start?.book, suggestion?.range?.start?.chapter, suggestion?.range?.start?.verse, suggestion?.range?.end?.book, suggestion?.range?.end?.chapter, suggestion?.range?.end?.verse])

  const heading = useMemo(() => {
    switch (suggestion?.type) {
    case 'SPEAKER_REFERENCE':
      return {
        Icon: Bookmark,
        text: 'Speaker is referencing'
      }
    case 'SPEAKER_REQUEST':
      return {
        Icon: BookOpenText,
        text: 'Speaker is requesting you turn to'
      }
    case 'SPEAKER_QUOTE':
      return {
        Icon: Quote,
        text: 'Speaker is quoting'
      }
    case 'ASSISTANT_RECOMMENDATION':
      return {
        Icon: Lightbulb,
        text: 'Velora recommends'
      }
    default:
      return {
        Icon: () => null,
        text: ''
      }
    }
  }, [suggestion?.type])

  return useMemo(() => {
    return suggestion ? {
      ...suggestion,
      passage,
      heading
    } : null
  }, [suggestion, passage, heading])
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
