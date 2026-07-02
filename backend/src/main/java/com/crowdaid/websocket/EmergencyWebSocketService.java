package com.crowdaid.websocket;

import com.crowdaid.dto.response.EmergencyResponse;
import com.crowdaid.dto.response.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Sends real-time messages over WebSocket / STOMP.
 *
 * Topics:
 *   /topic/emergencies            — global feed for all connected clients
 *   /topic/emergencies/{status}   — filtered by status change
 *   /user/{id}/queue/notifications — per-user notification queue
 *   /user/{id}/queue/emergencies   — per-helper emergency alerts
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyWebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /** Broadcast a new or updated emergency to all subscribers */
    public void broadcastEmergency(EmergencyResponse response) {
        messagingTemplate.convertAndSend("/topic/emergencies", response);
        log.debug("WS broadcast emergency id={}", response.getId());
    }

    /** Broadcast status change to relevant topic */
    public void broadcastStatusUpdate(com.crowdaid.entity.EmergencyRequest request) {
        messagingTemplate.convertAndSend(
                "/topic/emergencies/" + request.getStatus().name().toLowerCase(),
                request.getId()
        );
    }

    /** Send targeted emergency alert to a specific helper */
    public void sendToHelper(Long helperId, EmergencyResponse response) {
        messagingTemplate.convertAndSendToUser(
                helperId.toString(),
                "/queue/emergencies",
                response
        );
        log.debug("WS alert sent to helper id={}", helperId);
    }

    /** Send personal notification to a specific user */
    public void sendNotification(Long userId, NotificationResponse notification) {
        messagingTemplate.convertAndSendToUser(
                userId.toString(),
                "/queue/notifications",
                notification
        );
    }
}
