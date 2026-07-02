import api from './axios'
import type { ApiResponse, Page, Emergency, CreateEmergencyRequest, EmergencyStatus } from '../types'

export const emergencyApi = {
  create:     (data: CreateEmergencyRequest)       => api.post<ApiResponse<Emergency>>('/emergencies', data),
  getAll:     (page = 0, size = 10)                => api.get<ApiResponse<Page<Emergency>>>(`/emergencies?page=${page}&size=${size}&sort=createdAt,desc`),
  getById:    (id: number)                         => api.get<ApiResponse<Emergency>>(`/emergencies/${id}`),
  getByStatus:(status: EmergencyStatus, page = 0)  => api.get<ApiResponse<Page<Emergency>>>(`/emergencies/status/${status}?page=${page}`),
  getMine:    (page = 0)                           => api.get<ApiResponse<Page<Emergency>>>(`/emergencies/my?page=${page}`),
  updateStatus:(id: number, status: EmergencyStatus) => api.patch<ApiResponse<Emergency>>(`/emergencies/${id}/status?status=${status}`),
  delete:     (id: number)                         => api.delete<ApiResponse<void>>(`/emergencies/${id}`),
}
