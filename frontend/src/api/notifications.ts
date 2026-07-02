import api from './axios'
import type { ApiResponse, Page, Notification } from '../types'

export const notificationApi = {
  getAll:      (page = 0)  => api.get<ApiResponse<Page<Notification>>>(`/notifications?page=${page}&size=20`),
  getUnread:   ()          => api.get<ApiResponse<number>>('/notifications/unread-count'),
  markAllRead: ()          => api.patch<ApiResponse<void>>('/notifications/read-all'),
  markRead:    (id:number) => api.patch<ApiResponse<void>>(`/notifications/${id}/read`),
}
