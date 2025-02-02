import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated'
import { Dimensions, Pressable, TouchableOpacity, View } from 'react-native'
import { Mic } from '~/lib/icons/Mic'
import { Text } from '~/components/ui/text'
import { Separator } from '~/components/ui/separator'
import * as React from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useMostRecentSuggestion, useSession } from '~/hooks/useSessions'
import classnames from 'classnames'
import { Bookmark } from '~/lib/icons/Bookmark'
import { usePrevious } from '@uidotdev/usehooks'
import { BookOpenText } from '~/lib/icons/BookOpenText'
import { Quote } from '~/lib/icons/Quote'
import { Lightbulb } from '~/lib/icons/Lightbulb'

const handleHeight = 43
const handlePadding = 12
const handleHeightAndPadding = handleHeight + handlePadding * 2

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

let timeout: NodeJS.Timeout

type SessionSheetProps = {
  bottomTabBarHeight?: number
  animatedPosition: SharedValue<number>
}

export default function SessionSheet({
  animatedPosition,
  bottomTabBarHeight = 83,
}: SessionSheetProps) {
  const [position, setPosition] = useState(0)

  const [showSuggestion, setShowSuggestion] = useState(false)

  const { data } = useSession()
  const suggestion = useMostRecentSuggestion()

  const sheetRef = useRef<BottomSheet>(null)

  const startPoint = bottomTabBarHeight + handleHeightAndPadding

  const midPoint = 500

  const snapPoints = useMemo(() => [showSuggestion ?  startPoint + handleHeight + 14 : startPoint, midPoint, '100%'], [startPoint, showSuggestion])

  const handleHandlePress = useCallback(() => {
    if (position === 0) {
      sheetRef.current?.snapToIndex(1)
    } else if (position === 1) {
      //sheetRef.current?.snapToIndex(0)
    }
  }, [position])

  const animatedSheetContainerStyle = useAnimatedStyle(() => {
    const final = screenHeight - midPoint
    const start = screenHeight - startPoint
    const padding = interpolate(animatedPosition.value, [final, start-handleHeight-14, start], [0, handlePadding, handlePadding], Extrapolation.CLAMP)
    const width = interpolate(padding, [handlePadding, 0], [0, 2], Extrapolation.CLAMP)
    const marginLeft = interpolate(padding, [handlePadding, 0], [0, -1], Extrapolation.CLAMP)
    const marginTop = interpolate(animatedPosition.value, [final, 0], [0, -1], Extrapolation.CLAMP)
    console.log('Padding', padding)
    return {
      width: screenWidth + width,
      marginTop: marginTop,
      marginLeft: marginLeft,
      padding: padding,
    }
  })

  const animatedSheetStyle = useAnimatedStyle(() => {
    const final = screenHeight - midPoint
    const start = screenHeight - startPoint
    const difference = start - final
    const height = interpolate(animatedPosition.value, [0, final, start-handleHeight-14, start], [screenHeight, difference + handleHeightAndPadding + 1, handleHeight * 2 + 14, handleHeight], Extrapolation.CLAMP)
    const radius = interpolate(animatedPosition.value, [start, final], [8, 1], Extrapolation.CLAMP)
    return {
      height: height,
      borderBottomRightRadius: radius,
      borderBottomLeftRadius: radius,
    }
  })

  /*useEffect(() => {
    if (position === 0 && test) {
      sheetRef.current?.snapToPosition(startPoint + handleHeight + 14)
    } else if (position === 0 && !test) {
      sheetRef.current?.snapToIndex(0)
    }
  }, [position, test])*/

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

  const prevSuggestion = usePrevious(suggestion)

  useEffect(() => {
    if (suggestion?.startTime && prevSuggestion?.startTime !== suggestion?.startTime) {
      clearTimeout(timeout)
      setShowSuggestion(true)
      timeout = setTimeout(() => {
        setShowSuggestion(false)
      }, 15000)
    }
  }, [suggestion, prevSuggestion])

  const suggestionType = useMemo(() => {
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

  console.log('Session data', data)

  return (
    <View style={{ height: screenHeight }} className={classnames('absolute bottom-0 left-0 right-0', data ? '' : 'hidden')}>
      <BottomSheet
        ref={sheetRef}
        onChange={index => setPosition(index)}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        containerHeight={screenHeight}
        animatedPosition={animatedPosition}
        enableDynamicSizing={false}
        handleComponent={null}>
        <BottomSheetView>
          <Animated.View className={'h-full'} style={animatedSheetContainerStyle}>
            <Animated.View
              style={[{ minHeight: handleHeight }, animatedSheetStyle]}
              className={'rounded-lg border-border bg-card border-[0.5px] w-full flex flex-row p-3'}>
              <View className={'flex flex-row w-full justify-between'}>
                <View className={'flex flex-col-reverse justify-between'}>
                  <Pressable onPress={handleHandlePress} className={'flex flex-row justify-between w-full'}>
                    <View className={'flex flex-row gap-2'}>
                      <View>
                        <Mic size={20} className={'text-foreground'} />
                      </View>
                      <Text>{suggestion?.context}</Text>
                    </View>
                    <TouchableOpacity onPress={() => setShowSuggestion((value) => !value)} className={'flex'}>
                      { /*<Square size={20} className={'text-foreground'}/> */}
                    </TouchableOpacity>
                  </Pressable>
                  <View className={classnames('transition flex flex-col-reverse', showSuggestion ? 'opacity-1' : 'opacity-0')}>
                    <Separator className={'my-2'} />
                    <View className={'flex flex-row gap-2'}>
                      <suggestionType.Icon size={20} className={'text-foreground'} />
                      <View className={'flex'}>
                        <Text className={'text-sm text-muted-foreground'}>{suggestionType.text}</Text>
                        <Text className={'text-lg font-bold'}>{passageString}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Animated.View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  )
}