import type { EmergencyCategory } from '../types'

export const categoryMeta: Record<EmergencyCategory, { icon: string; label: string; bg: string; color: string }> = {
  BLOOD_DONATION:    { icon: '🩸', label: 'Blood Donation',    bg: '#fee2e2', color: '#dc2626' },
  MEDICAL_EMERGENCY: { icon: '🏥', label: 'Medical Emergency', bg: '#fef3c7', color: '#d97706' },
  ACCIDENT:          { icon: '⚠️', label: 'Accident',          bg: '#ffedd5', color: '#ea580c' },
  VEHICLE_BREAKDOWN: { icon: '🚗', label: 'Vehicle Breakdown', bg: '#dbeafe', color: '#2563eb' },
  LOST_PET:          { icon: '🐾', label: 'Lost Pet',          bg: '#d1fae5', color: '#059669' },
  DISASTER_RELIEF:   { icon: '🌊', label: 'Disaster Relief',   bg: '#ede9fe', color: '#7c3aed' },
  OTHER:             { icon: '❓', label: 'Other',             bg: '#f1f5f9', color: '#64748b' },
}

export const urgencyColor: Record<string, string> = {
  CRITICAL: '#ef4444', HIGH: '#f59e0b', MEDIUM: '#3b82f6', LOW: '#22c55e'
}

export const statusColor: Record<string, string> = {
  PENDING: '#f59e0b', ACTIVE: '#ef4444', RESOLVED: '#22c55e', CANCELLED: '#94a3b8'
}
