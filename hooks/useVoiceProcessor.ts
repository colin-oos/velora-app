import { VoiceProcessor } from '@picovoice/react-native-voice-processor'
import { DependencyList, useEffect, useMemo, useState } from 'react'
import { ExpoAudioStreamModule } from '@siteed/expo-audio-stream'

type UseVoiceProcessorParams = {
  onFrame?: (frame: ArrayBuffer) => void
}

export const useVoiceProcessor = ({ onFrame }: UseVoiceProcessorParams = {}, deps: DependencyList = []) => {
  const [isListening, setIsListening] = useState(false)
  const voiceProcessor = useMemo(() => VoiceProcessor.instance, [])

  useEffect(() => {
    return () => {
      voiceProcessor.removeFrameListener(frameListener)
    }
  }, [])

  const frameListener = (frame: number[]) => {
    const array = new Int16Array(frame)
    onFrame?.(array.buffer)
  }

  return {
    start: async () => {
      if (!isListening) {
        const { granted } = await ExpoAudioStreamModule.requestPermissionsAsync()
        if (granted) {
          voiceProcessor.addFrameListener(frameListener)
          await voiceProcessor.start(1000, 24000)
          setIsListening(true)
        }
      }
    },
    stop: async () => {
      voiceProcessor.removeFrameListener(frameListener)
      await voiceProcessor.stop()
      setIsListening(false)
    },
    isListening,
  }
}
