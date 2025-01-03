import React from "react"
import { Alert, Text, View } from "react-native"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import Constants from "expo-constants"
import { router } from "expo-router"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { useAuth } from "@/lib/context/auth"
import { UserCircle } from "@/lib/icons/UserCircle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const signInSchema = z.object({
  email: z.string().min(1, { message: "Required" }).email({
    message: "Invalid email address",
  }),
  password: z.string().min(8, { message: "Must be at least 8 characters" }),
})

export type SignInSchema = z.infer<typeof signInSchema>

export default function SignInScreen() {
  const { login } = useAuth()

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      router.navigate("/")
    },
    onError: error => {
      Alert.alert("Error", error.message || "Failed to sign in")
    },
  })

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignInSchema>({
    mode: "all",
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(formData: SignInSchema) {
    mutation.mutate(formData)
  }

  return (
    <View className="flex-1 flex-col justify-center gap-8 p-4">
      <View className="flex-row items-center justify-center gap-2">
        <UserCircle />
        <Text className="text-2xl font-bold">Sign In</Text>
      </View>
      <View className="flex-col gap-3">
        <Text className="font-semibold">Email</Text>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              placeholder="Enter your email"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />
        {errors.email && (
          <Text className="text-destructive">{errors.email.message}</Text>
        )}
      </View>
      <View className="flex-col gap-3">
        <Text className="font-semibold">Password</Text>
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <Input
              onBlur={field.onBlur}
              onChangeText={field.onChange}
              value={field.value}
              secureTextEntry
              placeholder="Enter your password"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}
        />
        {errors.password && (
          <Text className="text-destructive">{errors.password.message}</Text>
        )}
      </View>
      <View className="mt-14 flex-col gap-8">
        <View>
          <Button
            variant="outline"
            onPress={() => {
              reset({
                email: "",
                password: "",
              })
            }}
          >
            <Text>Reset</Text>
          </Button>
        </View>

        <View>
          <Button
            onPress={handleSubmit(onSubmit)}
            disabled={mutation.isPending}
          >
            <Text className="text-primary-foreground">Submit</Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
