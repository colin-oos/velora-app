import { Mic } from '~/lib/icons/Mic'
import { TouchableOpacity, View } from 'react-native'
import * as React from 'react'
import { useSession } from '~/hooks/useSessions'

type ActionFabProps = {
  bottomTabBarHeight?: number
}

export default function ActionFab({
  bottomTabBarHeight = 83,
}) {
  const session = useSession()

  const handleOnPress = async () => {
    await session.start()
  }

  return (
    <View style={{ paddingBottom: bottomTabBarHeight + (session.data ? 67 : 0)}} className="absolute transition-all duration-300 ease-in-out bottom-0 left-0 right-0 flex-1 justify-center items-center gap-5">
      <View>
        <TouchableOpacity onPress={handleOnPress} className={'bg-foreground p-4 rounded-full'}>
          <Mic size={32} className={'text-background'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}