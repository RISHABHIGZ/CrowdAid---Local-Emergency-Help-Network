import api from './axios'
import type { ApiResponse, User, Page } from '../types'

export const userApi = {
  getMe:        ()           => api.get<ApiResponse<User>>('/users/me'),
  updateMe:     (data: Partial<User>) => api.put<ApiResponse<User>>('/users/me', data),
  getById:      (id: number) => api.get<ApiResponse<User>>(`/users/${id}`),
  getAllAdmin:   (page = 0)   => api.get<ApiResponse<Page<User>>>(`/admin/users?page=${page}`),
  banUser:      (id: number) => api.patch<ApiResponse<void>>(`/admin/users/${id}/ban`),
  unbanUser:    (id: number) => api.patch<ApiResponse<void>>(`/admin/users/${id}/unban`),
}
