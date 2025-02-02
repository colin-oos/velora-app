import { useEffect, useRef, useState } from 'react'
import { Suggestion, TranscriptPart, ResponseData } from '~/store/slices/sessions/sessionTypes'
import * as actions from '~/store/slices/sessions'
import { useAppDispatch } from '~/store/hooks'
import { useVoiceProcessor } from '~/hooks/useVoiceProcessor'

const url = 'ws://bible--publi-qmw3xtn0apxb-90291305.us-east-2.elb.amazonaws.com/analyze-sermon'

export const useAnalyzeSession = (sessionId: string) => {
  // Track the connection status
  // (e.g., WebSocket.CONNECTING, WebSocket.OPEN, etc.)
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)

  const wsRef = useRef<WebSocket | null>(null)

  const dispatch = useAppDispatch()

  const addTranscriptPart = (transcriptPart: TranscriptPart) => {
    dispatch(actions.addTranscriptPart({ sessionId, transcriptPart }))
  }
  const addSuggestion = (suggestion: Suggestion) => {
    dispatch(actions.addSuggestion({ sessionId, suggestion }))
  }

  const sendMessage = async (msg: string | ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg)
    } else {
      console.warn('WebSocket is not open. Message not sent:', msg)
    }
  }

  const closeConnection = () => {
    if (wsRef.current && wsRef.current.readyState !== WebSocket.CLOSED) {
      wsRef.current.close()
      setReadyState(wsRef.current.readyState)
    }
  }

  const voiceProcessor = useVoiceProcessor({
    onFrame: async frame => {
      await sendMessage(frame)
    },
  }, [sessionId])

  useEffect(() => {
    return () => {
      console.log('Closing')
      closeConnection()
    }
  }, [])

  // Pass a function to useAppSelector so you can pass in the ID
  return {
    start: async () => {
      console.log('Starting session:', sessionId)
      const ws = new WebSocket(url)

      ws.onopen = () => {
        console.log(`WebSocket connected: ${url}`)
        setReadyState(ws.readyState)
      }

      // Handle incoming messages
      ws.onmessage = event => {
        const data = JSON.parse(event.data) as ResponseData

        console.log('Response', data)

        if (data.type === 'transcript') {
          addTranscriptPart(data)
        } else {
          addSuggestion(data)
        }
      }

      // Handle errors
      ws.onerror = err => {
        console.error(`WebSocket error (${url}):`, err)
      }

      // Handle connection close
      ws.onclose = () => {
        console.log(`WebSocket disconnected: ${url}`)
        setReadyState(ws.readyState)
      }

      // Keep it in a ref, so we can use it to send messages
      wsRef.current = ws

      await voiceProcessor.start()
    },
    stop: async () => {
      await voiceProcessor.stop()
      closeConnection()
    },
    readyState,
  }
}
