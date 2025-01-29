import { VoiceProcessor } from '@picovoice/react-native-voice-processor'
import { useEffect, useMemo, useState } from 'react'
import { ExpoAudioStreamModule } from '@siteed/expo-audio-stream'

type UseVoiceProcessorParams = {
  onFrame?: (frame: ArrayBuffer) => void
}

export const useVoiceProcessor = ({ onFrame }: UseVoiceProcessorParams = {}) => {
  const [isListening, setIsListening] = useState(false)
  const voiceProcessor = useMemo(() => VoiceProcessor.instance, [])

  useEffect(() => {
    voiceProcessor.addFrameListener(frameListener)

    return () => {
      voiceProcessor.removeFrameListener(frameListener)
    }
  })

  const frameListener = (frame: number[]) => {
    const array = new Int16Array(frame)
    onFrame?.(array.buffer)
  }

  return {
    start: async () => {
      if (!isListening) {
        const { granted } = await ExpoAudioStreamModule.requestPermissionsAsync()
        if (granted) {
          await voiceProcessor.start(1000, 24000)
          setIsListening(true)
        }
      }
    },
    stop: async () => {
      await voiceProcessor.stop()
      setIsListening(false)
    },
    isListening,
  }
}
