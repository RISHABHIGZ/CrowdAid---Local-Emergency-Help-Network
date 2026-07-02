import api from './axios'
import type { ApiResponse, Analytics } from '../types'

export const analyticsApi = {
  getDashboard: () => api.get<ApiResponse<Analytics>>('/admin/analytics'),
}
