import * as React from 'react'
import { FlatList, SafeAreaView, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import Animated, { FadeInUp, FadeOutDown, LayoutAnimationConfig } from 'react-native-reanimated'
import { Info } from '~/lib/icons/Info'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import { Separator } from '~/components/ui/separator'
import { Mic } from '~/lib/icons/Mic'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card'
import { Progress } from '~/components/ui/progress'
import { Text } from '~/components/ui/text'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'

const GITHUB_AVATAR_URI = 'https://i.pinimg.com/originals/ef/a2/8d/efa28d18a04e7fa40ed49eeb0ab660db.jpg'

type Sermon = {
  name: string
  date: Date
  duration: number
}

const today = new Date()
const yesterday = new Date(today)
const threeDaysAgo = new Date(today)

const sermons = [
  {
    name: 'Sermon 1',
    date: today,
    duration: 2100,
  },
  {
    name: 'Sermon 2',
    date: today,
    duration: 2346,
  },
  {
    name: 'Sermon 3',
    date: yesterday,
    duration: 2790,
  },
  {
    name: 'Sermon 4',
    date: yesterday,
    duration: 2067,
  },
  {
    name: 'Sermon 5',
    date: threeDaysAgo,
    duration: 2115,
  },
  {
    name: 'Sermon 6',
    date: threeDaysAgo,
    duration: 2890,
  },
]

const formatTime = (duration: number) => {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`
}

const renderItem = ({ item }: { item: Sermon }) => {
  return (
    <TouchableOpacity className={'flex justify-items-center'}>
      <View className={'flex gap-1'}>
        <Text className={'font-bold text-lg'}>{item.name}</Text>
        <View className={'flex flex-row justify-between'}>
          <Text className={'text-muted-foreground'}>{item.date.toDateString()}</Text>
          <Text className={'text-muted-foreground'}>{formatTime(item.duration)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const ItemSeparator = () => {
  return (
    <View className={'py-3 w-full'}>
      <Separator />
    </View>
  )
}

export default function Screen() {
  const [progress, setProgress] = React.useState(78)

  function updateProgressValue() {
    setProgress(Math.floor(Math.random() * 100))
  }
  return (
    <SafeAreaView className="flex-1 justify-center items-center gap-5">
      <FlatList
        className={'w-full'}
        contentContainerClassName={'pt-3 px-4'}
        data={sermons}
        renderItem={renderItem}
        ItemSeparatorComponent={ItemSeparator}
      />
      {/*<Card className='w-full max-w-sm p-6 rounded-2xl'>
        <CardHeader className='items-center'>
          <Avatar alt="Rick Sanchez's Avatar" className='w-24 h-24'>
            <AvatarImage source={{ uri: GITHUB_AVATAR_URI }} />
            <AvatarFallback>
              <Text>RS</Text>
            </AvatarFallback>
          </Avatar>
          <View className='p-3' />
          <CardTitle className='pb-2 text-center'>Rick Sanchez</CardTitle>
          <View className='flex-row'>
            <CardDescription className='text-base font-semibold'>Scientist</CardDescription>
            <Tooltip delayDuration={150}>
              <TooltipTrigger className='px-2 pb-0.5 active:opacity-50'>
                <Info size={14} strokeWidth={2.5} className='w-4 h-4 text-foreground/70' />
              </TooltipTrigger>
              <TooltipContent className='py-2 px-4 shadow'>
                <Text className='native:text-lg'>Freelance</Text>
              </TooltipContent>
            </Tooltip>
          </View>
        </CardHeader>
        <CardContent>
          <View className='flex-row justify-around gap-3'>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Dimension</Text>
              <Text className='text-xl font-semibold'>C-137</Text>
            </View>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Age</Text>
              <Text className='text-xl font-semibold'>70</Text>
            </View>
            <View className='items-center'>
              <Text className='text-sm text-muted-foreground'>Species</Text>
              <Text className='text-xl font-semibold'>Human</Text>
            </View>
          </View>
        </CardContent>
        <CardFooter className='flex-col gap-3 pb-0'>
          <View className='flex-row items-center overflow-hidden'>
            <Text className='text-sm text-muted-foreground'>Productivity:</Text>
            <LayoutAnimationConfig skipEntering>
              <Animated.View
                key={progress}
                entering={FadeInUp}
                exiting={FadeOutDown}
                className='w-11 items-center'
              >
                <Text className='text-sm font-bold text-sky-600'>{progress}%</Text>
              </Animated.View>
            </LayoutAnimationConfig>
          </View>
          <Progress value={progress} className='h-2' indicatorClassName='bg-sky-600' />
          <View />
          <Button
            variant='outline'
            className='shadow shadow-foreground/5'
            onPress={updateProgressValue}
          >
            <Text>Update</Text>
          </Button>
        </CardFooter>
      </Card>*/}
    </SafeAreaView>
  )
}
