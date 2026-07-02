import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAppSelector } from '../store'
import type { Emergency, Notification } from '../types'

interface Handlers {
  onEmergency?:    (e: Emergency) => void
  onNotification?: (n: Notification) => void
}

/**
 * Connects to the Spring Boot STOMP WebSocket endpoint and subscribes
 * to emergency broadcasts and personal notifications.
 */
export function useWebSocket({ onEmergency, onNotification }: Handlers = {}) {
  const clientRef = useRef<Client | null>(null)
  const user      = useAppSelector(s => s.auth.user)
  const token     = localStorage.getItem('accessToken')

  useEffect(() => {
    if (!user || !token) return

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      connectHeaders:   { Authorization: `Bearer ${token}` },
      reconnectDelay:   5000,
      onConnect: () => {
        // Global emergency feed
        client.subscribe('/topic/emergencies', msg => {
          try { onEmergency?.(JSON.parse(msg.body)) } catch {}
        })

        // Personal notification queue
        client.subscribe(`/user/${user.userId}/queue/notifications`, msg => {
          try { onNotification?.(JSON.parse(msg.body)) } catch {}
        })

        // Personal emergency alerts (for helpers)
        if (user.roles.includes('ROLE_HELPER')) {
          client.subscribe(`/user/${user.userId}/queue/emergencies`, msg => {
            try { onEmergency?.(JSON.parse(msg.body)) } catch {}
          })
        }
      },
      onStompError: frame => {
        console.error('STOMP error:', frame.headers?.message)
      },
    })

    client.activate()
    clientRef.current = client

    return () => { client.deactivate() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.userId, token])

  return clientRef
}
