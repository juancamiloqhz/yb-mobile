import axios from "axios"
import * as SecureStore from "expo-secure-store"

// import { signOutUser } from "@/slices/auth.slice"
import { AUTH_TOKEN_KEY, REFRESHED_TOKEN_HEADER } from "@/lib/constants"

// import { store } from "@/lib/redux/store"

const apiCamelback = axios.create({
  baseURL: "http://localhost:3000",
})

apiCamelback.interceptors.request.use(
  async config => {
    // const token = localStorage.getItem(AUTH_TOKEN_KEY)
    const token = await SecureStore.getItemAsync(AUTH_TOKEN_KEY)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    config.headers.Accept = `application/json`
    return config
  },
  error => Promise.reject(error)
)

apiCamelback.interceptors.response.use(
  async response => {
    // Check for refreshed token in response headers
    const refreshedToken = response.headers[REFRESHED_TOKEN_HEADER]
    if (refreshedToken) {
      await SecureStore.setItemAsync(AUTH_TOKEN_KEY, refreshedToken)
    }
    return response
  },
  async error => {
    if (error.response?.status === 401) {
      // Dispatch the sign out action which will clear the token and user state
      // await store.dispatch(signOutUser())
      await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY)
      return Promise.reject(new Error("Session expired. Please log in again."))
    }
    console.log("error apiCamelback", error)
    return Promise.reject(error)
  }
)

export default apiCamelback
