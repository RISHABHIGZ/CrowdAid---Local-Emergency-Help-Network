import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse } from '../types'

interface AuthState {
  user: AuthResponse | null
  isAuthenticated: boolean
  loading: boolean
}

const stored = localStorage.getItem('auth')
const initial: AuthState = {
  user: stored ? JSON.parse(stored) : null,
  isAuthenticated: !!stored,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initial,
  reducers: {
    setCredentials(state, action: PayloadAction<AuthResponse>) {
      state.user = action.payload
      state.isAuthenticated = true
      localStorage.setItem('auth', JSON.stringify(action.payload))
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
    },
    logout(state) {
      state.user = null
      state.isAuthenticated = false
      localStorage.clear()
    },
    setLoading(state, { payload }: PayloadAction<boolean>) {
      state.loading = payload
    },
  },
})

export const { setCredentials, logout, setLoading } = authSlice.actions
export default authSlice.reducer
