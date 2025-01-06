import React from "react"
import { View } from "react-native"

import { Text } from "@/components/ui/text"

export default function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Loading...</Text>
    </View>
  )
}
