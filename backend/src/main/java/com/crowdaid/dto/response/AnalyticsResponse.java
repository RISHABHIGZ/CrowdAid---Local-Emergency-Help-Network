package com.crowdaid.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.Map;
import java.util.List;

@Data
@Builder
public class AnalyticsResponse {
    private long totalUsers;
    private long activeEmergencies;
    private long resolvedEmergencies;
    private long totalEmergencies;
    private Double averageResponseTimeSecs;
    private Double resolutionRate;
    private Map<String, Long> emergenciesByCategory;
    private List<Map<String, Object>> dailyActivity;
    private List<UserResponse> topHelpers;
}
