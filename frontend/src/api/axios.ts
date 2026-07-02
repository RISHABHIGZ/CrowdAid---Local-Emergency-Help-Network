import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

// Attach JWT on every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally — auto-logout
api.interceptors.response.use(
  res => res,
  err => {
    const status = err.response?.status
    const msg    = err.response?.data?.error || err.response?.data?.message

    if (status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    } else if (status === 403) {
      toast.error('Access denied')
    } else if (status >= 500) {
      toast.error('Server error — please try again')
    } else if (msg) {
      toast.error(msg)
    }
    return Promise.reject(err)
  }
)

export default api
