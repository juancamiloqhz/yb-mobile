import React from "react"
import { View } from "react-native"

import { useUserStore } from "@/lib/store/user"
import { Text } from "@/components/ui/text"

export default function Profile() {
  const { user } = useUserStore()
  return (
    <View>
      <Text>Profile</Text>
      <Text>Name: {user?.first_name}</Text>
      <Text>Email: {user?.email}</Text>
    </View>
  )
}
