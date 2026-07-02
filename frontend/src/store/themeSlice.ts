import { createSlice } from '@reduxjs/toolkit'

const isDark = localStorage.getItem('theme') === 'dark'
if (isDark) document.documentElement.classList.add('dark')

const themeSlice = createSlice({
  name: 'theme',
  initialState: { dark: isDark },
  reducers: {
    toggleTheme(state) {
      state.dark = !state.dark
      document.documentElement.classList.toggle('dark', state.dark)
      localStorage.setItem('theme', state.dark ? 'dark' : 'light')
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
