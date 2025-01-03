import { create } from "zustand"

import { User } from "@/types/temp-types"
import apiCamelback from "@/lib/api/apiCamelback"

interface UserStore {
  user: User | null
  loading: boolean
  error: string | null
  setUser: (user: User | null) => void
  fetchUser: () => Promise<void>
}

export const useUserStore = create<UserStore>(set => ({
  user: null,
  loading: false,
  error: null,
  setUser: (user: User | null) => set({ user }),
  fetchUser: async () => {
    try {
      set({ loading: true })
      const response = await apiCamelback.get<{ user: User }>(
        "/api/v1/users/me"
      )
      set({ user: response.data.user, loading: false })
    } catch (error) {
      console.error("Error fetching user:", error)
      set({ error: "Failed to fetch user", loading: false })
    }
  },
}))
