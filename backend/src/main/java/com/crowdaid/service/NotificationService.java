package com.crowdaid.service;

import com.crowdaid.dto.response.NotificationResponse;
import com.crowdaid.entity.EmergencyRequest;
import com.crowdaid.entity.Notification;
import com.crowdaid.entity.User;
import com.crowdaid.enums.NotificationType;
import com.crowdaid.repository.NotificationRepository;
import com.crowdaid.websocket.EmergencyWebSocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final EmergencyWebSocketService wsService;

    @Transactional
    public void sendToUser(User user, String title, String message,
                           NotificationType type, EmergencyRequest emergency) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .message(message)
                .type(type)
                .emergency(emergency)
                .build();

        Notification saved = notificationRepo.save(notification);

        // Push real-time notification via WebSocket
        wsService.sendNotification(user.getId(), toResponse(saved));
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponse> getMyNotifications(Long userId, Pageable pageable) {
        return notificationRepo.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public long getUnreadCount(Long userId) {
        return notificationRepo.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepo.markAllReadByUserId(userId);
    }

    @Transactional
    public void markRead(Long notificationId, Long userId) {
        notificationRepo.markReadById(notificationId, userId);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .title(n.getTitle())
                .message(n.getMessage())
                .type(n.getType())
                .isRead(n.getIsRead())
                .emergencyId(n.getEmergency() != null ? n.getEmergency().getId() : null)
                .createdAt(n.getCreatedAt())
                .build();
    }
}
