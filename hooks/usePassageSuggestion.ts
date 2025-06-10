import { useMostRecentSuggestion } from '~/hooks/useSessions'
import { useEffect, useMemo, useState } from 'react'
import { usePrevious } from '@uidotdev/usehooks'
import { Bookmark } from '~/lib/icons/Bookmark'

//let timeout: NodeJS.Timeout
const showDelay = 15000

export default function usePassageSuggestion() {
  const [show, setShow] = useState(true)

  const suggestion = useMostRecentSuggestion()
  const prevSuggestion = usePrevious(suggestion)

  const timeout = useMemo(() => {
    if (suggestion?.endTime && prevSuggestion?.endTime !== suggestion?.endTime) {
      console.log('Show suggestion')
      clearTimeout(timeout)
      setShow(true)
      return setTimeout(() => {
        console.log('Hide suggestion')
        setShow(false)
      }, showDelay)
    }
  }, [setShow, suggestion?.endTime, prevSuggestion?.endTime])

  /*useEffect(() => {
    if (suggestion?.endTime && prevSuggestion?.endTime !== suggestion?.endTime) {
      console.log('Show suggestion')
      clearTimeout(timeout)
      setShow(true)
      timeout = setTimeout(() => {
        console.log('Hide suggestion')
        setShow(false)
      }, showDelay)
    }
  }, [setShow, suggestion?.endTime, prevSuggestion?.endTime])*/

  /*suggestion = {
    ...suggestion,
    heading: {
      text: 'Example heading',
      Icon: Bookmark,
    },
    type: 'SPEAKER_REFERENCE',
    passage: 'John 3:16',
    context: 'Example context',
  }*/

  return useMemo(() => {
    return suggestion ? {
      ...suggestion,
      show,
    } : null
  }, [suggestion, show])
}