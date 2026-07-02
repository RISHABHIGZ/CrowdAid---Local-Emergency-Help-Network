package com.crowdaid.dto.response;

import com.crowdaid.enums.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Boolean isRead;
    private Long emergencyId;
    private LocalDateTime createdAt;
}
