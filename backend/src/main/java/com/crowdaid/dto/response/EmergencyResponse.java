package com.crowdaid.dto.response;

import com.crowdaid.enums.EmergencyCategory;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.enums.UrgencyLevel;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class EmergencyResponse {
    private Long id;
    private String title;
    private String description;
    private EmergencyCategory category;
    private UrgencyLevel urgencyLevel;
    private EmergencyStatus status;
    private Double latitude;
    private Double longitude;
    private String address;
    private String contactNumber;
    private Integer requiredHelpers;
    private Double aiSeverityScore;
    private Long requesterId;
    private String requesterName;
    private Integer activeHelpers;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
}
