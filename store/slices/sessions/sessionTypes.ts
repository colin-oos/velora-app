// store/slices/sessionTypes.ts

export type TranscriptPart = {
  type: 'transcript'
  isPartial: boolean
  text: string
  startTime?: number | null
  endTime?: number | null
  isTrusted: boolean
}

export type TranscriptText = {
  final: string
  partial?: string | null
  current: string
}

export type Transcript = {
  parts: TranscriptPart[]
  text?: TranscriptText | null
}

export type SuggestionType = 'SPEAKER_REFERENCE' | 'SPEAKER_REQUEST' | 'SPEAKER_QUOTE' | 'ASSISTANT_RECOMMENDATION'

export type Suggestion = {
  type: SuggestionType
  book?: string | null
  chapter?: number | null
  verse?: number | null
  context?: string | null
  range?: {
    start: {
      book: string
      chapter: number
      verse: number
    }
    end: {
      book: string
      chapter: number
      verse: number
    }
  }
  startTime?: number | null
  endTime?: number | null
}

export type Session = {
  id: string
  startTime: number
  endTime?: number | null
  transcript?: Transcript | null
  suggestions: Suggestion[]
}

// WebSocket response types
export type ResponseData = TranscriptPart | Suggestion

export type Response = {
  data: ResponseData
}
