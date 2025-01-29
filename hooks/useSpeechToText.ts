import { useEffect, useRef, useState } from 'react'
import { ResponseData } from '~/store/slices/sessions/sessionTypes'

export interface UseWebSocketReturn {
  transcript: string
  sendMessage: (msg: string | ArrayBuffer) => void
}

const url = 'ws://bible--publi-qmw3xtn0apxb-90291305.us-east-2.elb.amazonaws.com/analyze-sermon'

export function useSpeechToText(): UseWebSocketReturn {
  const [finalTranscript, setFinalTranscript] = useState<string>('')
  const [interimTranscript, setInterimTranscript] = useState<string>('')

  // Track the connection status
  // (e.g., WebSocket.CONNECTING, WebSocket.OPEN, etc.)
  const [readyState, setReadyState] = useState<number>(WebSocket.CONNECTING)

  // Keep a ref to the active WebSocket instance
  const wsRef = useRef<WebSocket | null>(null)

  // Function to send messages
  const sendMessage = (msg: string | ArrayBuffer) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(msg)
    } else {
      console.warn('WebSocket is not open. Message not sent:', msg)
    }
  }

  // Create / clean up the WebSocket on mount / unmount
  useEffect(() => {
    const ws = new WebSocket(url)

    // Handle connection open
    ws.onopen = () => {
      console.log(`WebSocket connected: ${url}`)
      setReadyState(ws.readyState)
    }

    // Handle incoming messages
    ws.onmessage = event => {
      //console.log('Response:', event)
      const data = JSON.parse(event.data) as ResponseData

      console.log('Response:', data)

      if (data.type === 'transcript') {
        if (data.isPartial) {
          setInterimTranscript(data.text)
        } else if (data.text) {
          setFinalTranscript(data.text)
          setInterimTranscript('')
        }
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

    // Cleanup: close WS on component unmount
    return () => {
      ws.close()
    }
  }, [url])

  let transcript = finalTranscript
  if (interimTranscript != '') {
    transcript += ' ' + interimTranscript
  }

  return {
    transcript,
    sendMessage,
  }
}
