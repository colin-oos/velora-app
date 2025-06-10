import classnames from 'classnames'
import { Separator } from '~/components/ui/separator'
import { View } from 'react-native'
import { Text } from '~/components/ui/text'
import * as React from 'react'
import usePassageSuggestion from '~/hooks/usePassageSuggestion'


export default function SessionHeader() {
  const suggestion = usePassageSuggestion()

  return (
    <View className={classnames('px-2.5 transition flex flex-row gap-2 w-full mb-2.5', suggestion?.show ? 'opacity-1' : 'opacity-0')}>
      <View className={'py-3.5 flex flex-row gap-2 border-b-[1px] border-border w-full'}>
        { suggestion && <suggestion.heading.Icon size={24} className={'text-background'} /> }
        <View className={'flex gap-1'}>
          <Text className={'text-xs font-medium text-muted-foreground'}>{suggestion?.heading.text}</Text>
          <Text className={'text-md font-bold'}>{suggestion?.passage}</Text>
        </View>
      </View>
    </View>
  )
}