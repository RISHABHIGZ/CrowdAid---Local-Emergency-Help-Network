package com.crowdaid.service.impl;

import com.crowdaid.dto.request.EmergencyRequestDto;
import com.crowdaid.dto.response.EmergencyResponse;
import com.crowdaid.entity.EmergencyRequest;
import com.crowdaid.entity.User;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.enums.NotificationType;
import com.crowdaid.enums.RoleName;
import com.crowdaid.exception.BadRequestException;
import com.crowdaid.exception.ResourceNotFoundException;
import com.crowdaid.exception.UnauthorizedException;
import com.crowdaid.repository.EmergencyRequestRepository;
import com.crowdaid.repository.UserRepository;
import com.crowdaid.service.EmergencyService;
import com.crowdaid.service.NotificationService;
import com.crowdaid.util.AiUrgencyClassifier;
import com.crowdaid.util.GeoUtils;
import com.crowdaid.websocket.EmergencyWebSocketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmergencyServiceImpl implements EmergencyService {

    private final EmergencyRequestRepository emergencyRepo;
    private final UserRepository             userRepo;
    private final NotificationService        notificationService;
    private final EmergencyWebSocketService  wsService;
    private final AiUrgencyClassifier        aiClassifier;

    @Value("${crowdaid.emergency.search-radius-km:10}")
    private double searchRadiusKm;

    @Override
    @Transactional
    public EmergencyResponse createRequest(EmergencyRequestDto dto, String requesterEmail) {
        User requester = findUser(requesterEmail);

        double aiScore = aiClassifier.classify(dto.getDescription(), dto.getCategory(), dto.getUrgencyLevel());

        EmergencyRequest request = EmergencyRequest.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .category(dto.getCategory())
                .urgencyLevel(dto.getUrgencyLevel())
                .latitude(dto.getLatitude())
                .longitude(dto.getLongitude())
                .address(dto.getAddress())
                .contactNumber(dto.getContactNumber())
                .requiredHelpers(dto.getRequiredHelpers())
                .aiSeverityScore(aiScore)
                .requester(requester)
                .build();

        EmergencyRequest saved = emergencyRepo.save(request);

        // Broadcast to nearby helpers in real-time
        broadcastToNearbyHelpers(saved);

        log.info("Emergency request created: id={}, category={}", saved.getId(), saved.getCategory());
        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public EmergencyResponse getById(Long id) {
        return toResponse(findEmergency(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmergencyResponse> getAll(Pageable pageable) {
        return emergencyRepo.findAll(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmergencyResponse> getByStatus(EmergencyStatus status, Pageable pageable) {
        return emergencyRepo.findByStatus(status, pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EmergencyResponse> getMyRequests(String email, Pageable pageable) {
        User user = findUser(email);
        return emergencyRepo.findByRequesterId(user.getId(), pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public EmergencyResponse updateStatus(Long id, EmergencyStatus status, String email) {
        EmergencyRequest emergency = findEmergency(id);
        User actor = findUser(email);

        boolean isOwner = emergency.getRequester().getId().equals(actor.getId());
        boolean isAdmin = actor.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to update this request");
        }

        emergency.setStatus(status);
        if (status == EmergencyStatus.RESOLVED) {
            emergency.setResolvedAt(LocalDateTime.now());
        }

        EmergencyRequest updated = emergencyRepo.save(emergency);

        // Notify requester
        notificationService.sendToUser(
            emergency.getRequester(),
            "Request " + status.name(),
            "Your emergency request '" + emergency.getTitle() + "' is now " + status.name().toLowerCase(),
            NotificationType.REQUEST_RESOLVED,
            emergency
        );

        // Push live update via WebSocket
        wsService.broadcastStatusUpdate(updated);

        return toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteRequest(Long id, String email) {
        EmergencyRequest emergency = findEmergency(id);
        User actor = findUser(email);

        boolean isOwner = emergency.getRequester().getId().equals(actor.getId());
        boolean isAdmin = actor.getRoles().stream()
                .anyMatch(r -> r.getName() == RoleName.ROLE_ADMIN);

        if (!isOwner && !isAdmin) {
            throw new UnauthorizedException("You are not authorized to delete this request");
        }
        if (emergency.getStatus() == EmergencyStatus.ACTIVE) {
            throw new BadRequestException("Cannot delete an active emergency request");
        }

        emergencyRepo.delete(emergency);
        log.info("Emergency request deleted: id={}", id);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private void broadcastToNearbyHelpers(EmergencyRequest request) {
        // Fetch all available helpers then filter by radius in Java (DB-agnostic)
        List<User> nearbyHelpers = userRepo.findAvailableHelpers()
                .stream()
                .filter(h -> GeoUtils.haversineDistanceKm(
                        request.getLatitude(), request.getLongitude(),
                        h.getLatitude(), h.getLongitude()) <= searchRadiusKm)
                .collect(java.util.stream.Collectors.toList());

        nearbyHelpers.forEach(helper -> {
            notificationService.sendToUser(
                helper,
                "🚨 Emergency Nearby: " + request.getTitle(),
                request.getCategory().name() + " — " + request.getAddress(),
                NotificationType.EMERGENCY_NEARBY,
                request
            );
            wsService.sendToHelper(helper.getId(), toResponse(request));
        });

        log.info("Broadcasted emergency {} to {} nearby helpers", request.getId(), nearbyHelpers.size());
    }

    private EmergencyRequest findEmergency(Long id) {
        return emergencyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyRequest", id));
    }

    private User findUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private EmergencyResponse toResponse(EmergencyRequest e) {
        long activeHelpers = e.getHelperResponses() == null ? 0 :
                e.getHelperResponses().stream()
                        .filter(hr -> hr.getStatus().name().equals("ACCEPTED")
                                   || hr.getStatus().name().equals("EN_ROUTE")
                                   || hr.getStatus().name().equals("ARRIVED"))
                        .count();

        return EmergencyResponse.builder()
                .id(e.getId())
                .title(e.getTitle())
                .description(e.getDescription())
                .category(e.getCategory())
                .urgencyLevel(e.getUrgencyLevel())
                .status(e.getStatus())
                .latitude(e.getLatitude())
                .longitude(e.getLongitude())
                .address(e.getAddress())
                .contactNumber(e.getContactNumber())
                .requiredHelpers(e.getRequiredHelpers())
                .aiSeverityScore(e.getAiSeverityScore())
                .requesterId(e.getRequester().getId())
                .requesterName(e.getRequester().getFullName())
                .activeHelpers((int) activeHelpers)
                .resolvedAt(e.getResolvedAt())
                .createdAt(e.getCreatedAt())
                .build();
    }
}
