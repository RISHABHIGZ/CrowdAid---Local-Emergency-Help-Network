package com.crowdaid.service.impl;

import com.crowdaid.dto.response.AnalyticsResponse;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.repository.EmergencyRequestRepository;
import com.crowdaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl {

    private final EmergencyRequestRepository emergencyRepo;
    private final UserRepository userRepo;
    private final UserServiceImpl userService;

    @Transactional(readOnly = true)
    public AnalyticsResponse getDashboardAnalytics() {
        long total     = emergencyRepo.count();
        long active    = emergencyRepo.countByStatus(EmergencyStatus.ACTIVE)
                       + emergencyRepo.countByStatus(EmergencyStatus.PENDING);
        long resolved  = emergencyRepo.countByStatus(EmergencyStatus.RESOLVED);
        long totalUsers = userRepo.countActiveUsers();

        double resolutionRate = total > 0 ? (resolved * 100.0 / total) : 0;
        Double avgResponseTime = emergencyRepo.averageResponseTimeSeconds();

        // Category distribution
        Map<String, Long> byCategory = emergencyRepo.countGroupedByCategory()
                .stream()
                .collect(Collectors.toMap(
                        row -> row[0].toString(),
                        row -> ((Number) row[1]).longValue()
                ));

        // Daily activity (last 30 days)
        LocalDateTime since = LocalDateTime.now().minusDays(30);
        List<Map<String, Object>> daily = emergencyRepo.countDailyActivity(since)
                .stream()
                .map(row -> {
                    Map<String, Object> entry = new LinkedHashMap<>();
                    entry.put("date", row[0].toString());
                    entry.put("count", ((Number) row[1]).longValue());
                    return entry;
                })
                .collect(Collectors.toList());

        // Top 5 helpers
        var topHelpers = userRepo.findTopHelpersByTrustScore(PageRequest.of(0, 5))
                .stream()
                .map(userService::toResponse)
                .collect(Collectors.toList());

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .activeEmergencies(active)
                .resolvedEmergencies(resolved)
                .totalEmergencies(total)
                .averageResponseTimeSecs(avgResponseTime)
                .resolutionRate(Math.round(resolutionRate * 10.0) / 10.0)
                .emergenciesByCategory(byCategory)
                .dailyActivity(daily)
                .topHelpers(topHelpers)
                .build();
    }
}
