// ── Auth ────────────────────────────────────────────────
export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  userId: number
  email: string
  fullName: string
  roles: string[]
}

export interface LoginRequest  { email: string; password: string }
export interface RegisterRequest {
  fullName: string; email: string; password: string
  phone?: string; registerAsHelper: boolean
}

// ── User ────────────────────────────────────────────────
export interface User {
  id: number
  fullName: string
  email: string
  phone?: string
  profileImageUrl?: string
  address?: string
  latitude?: number
  longitude?: number
  trustScore: number
  isVerified: boolean
  isAvailable: boolean
  roles: string[]
  createdAt: string
}

// ── Emergency ───────────────────────────────────────────
export type EmergencyCategory =
  | 'BLOOD_DONATION' | 'MEDICAL_EMERGENCY' | 'ACCIDENT'
  | 'VEHICLE_BREAKDOWN' | 'LOST_PET' | 'DISASTER_RELIEF' | 'OTHER'

export type UrgencyLevel   = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type EmergencyStatus = 'PENDING' | 'ACTIVE' | 'RESOLVED' | 'CANCELLED'

export interface Emergency {
  id: number
  title: string
  description: string
  category: EmergencyCategory
  urgencyLevel: UrgencyLevel
  status: EmergencyStatus
  latitude: number
  longitude: number
  address?: string
  contactNumber?: string
  requiredHelpers: number
  aiSeverityScore?: number
  requesterId: number
  requesterName: string
  activeHelpers: number
  resolvedAt?: string
  createdAt: string
}

export interface CreateEmergencyRequest {
  title: string; description: string
  category: EmergencyCategory; urgencyLevel: UrgencyLevel
  latitude: number; longitude: number
  address?: string; contactNumber?: string; requiredHelpers: number
}

// ── Notification ────────────────────────────────────────
export type NotificationType =
  | 'EMERGENCY_NEARBY' | 'HELPER_ACCEPTED' | 'HELPER_ARRIVED'
  | 'REQUEST_RESOLVED' | 'REQUEST_CANCELLED' | 'RATING_RECEIVED'
  | 'SYSTEM_ALERT' | 'ACCOUNT_VERIFIED'

export interface Notification {
  id: number; title: string; message: string
  type: NotificationType; isRead: boolean
  emergencyId?: number; createdAt: string
}

// ── Rating ──────────────────────────────────────────────
export interface RatingRequest {
  emergencyId: number; rateeId: number; score: number; comment?: string
}

// ── Analytics ───────────────────────────────────────────
export interface Analytics {
  totalUsers: number
  activeEmergencies: number
  resolvedEmergencies: number
  totalEmergencies: number
  averageResponseTimeSecs?: number
  resolutionRate: number
  emergenciesByCategory: Record<string, number>
  dailyActivity: Array<{ date: string; count: number }>
  topHelpers: User[]
}

// ── API ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean; message?: string; data: T; error?: string; timestamp: string
}

export interface Page<T> {
  content: T[]; totalElements: number; totalPages: number
  number: number; size: number; first: boolean; last: boolean
}
