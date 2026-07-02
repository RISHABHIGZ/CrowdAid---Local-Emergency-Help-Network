package com.crowdaid.service.impl;

import com.crowdaid.entity.EmergencyRequest;
import com.crowdaid.entity.HelperResponse;
import com.crowdaid.entity.User;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.enums.NotificationType;
import com.crowdaid.enums.ResponseStatus;
import com.crowdaid.exception.BadRequestException;
import com.crowdaid.exception.ResourceNotFoundException;
import com.crowdaid.repository.EmergencyRequestRepository;
import com.crowdaid.repository.HelperResponseRepository;
import com.crowdaid.repository.UserRepository;
import com.crowdaid.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class HelperResponseServiceImpl {

    private final HelperResponseRepository helperResponseRepo;
    private final EmergencyRequestRepository emergencyRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    @Transactional
    public HelperResponse acceptRequest(Long emergencyId, String helperEmail) {
        User helper = findUser(helperEmail);
        EmergencyRequest emergency = findEmergency(emergencyId);

        if (emergency.getStatus() == EmergencyStatus.RESOLVED ||
            emergency.getStatus() == EmergencyStatus.CANCELLED) {
            throw new BadRequestException("Emergency is no longer active");
        }

        if (helperResponseRepo.existsByEmergencyIdAndHelperId(emergencyId, helper.getId())) {
            throw new BadRequestException("You have already responded to this emergency");
        }

        long acceptedCount = helperResponseRepo.countByEmergencyIdAndStatus(emergencyId, ResponseStatus.ACCEPTED);
        if (acceptedCount >= emergency.getRequiredHelpers()) {
            throw new BadRequestException("Required number of helpers already reached");
        }

        // Calculate response time from emergency creation
        long secs = ChronoUnit.SECONDS.between(emergency.getCreatedAt(), LocalDateTime.now());

        HelperResponse response = HelperResponse.builder()
                .emergency(emergency)
                .helper(helper)
                .status(ResponseStatus.ACCEPTED)
                .responseTimeSecs((int) secs)
                .build();

        HelperResponse saved = helperResponseRepo.save(response);

        // Activate emergency if this is the first helper
        if (emergency.getStatus() == EmergencyStatus.PENDING) {
            emergency.setStatus(EmergencyStatus.ACTIVE);
            emergencyRepo.save(emergency);
        }

        // Notify the requester
        notificationService.sendToUser(
            emergency.getRequester(),
            "Helper is on the way!",
            helper.getFullName() + " has accepted your emergency request",
            NotificationType.HELPER_ACCEPTED,
            emergency
        );

        log.info("Helper {} accepted emergency {}", helper.getEmail(), emergencyId);
        return saved;
    }

    @Transactional
    public HelperResponse markArrived(Long emergencyId, String helperEmail) {
        User helper = findUser(helperEmail);
        HelperResponse response = helperResponseRepo
                .findByEmergencyIdAndHelperId(emergencyId, helper.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Response not found"));

        response.setStatus(ResponseStatus.ARRIVED);
        response.setArrivedAt(LocalDateTime.now());
        HelperResponse saved = helperResponseRepo.save(response);

        notificationService.sendToUser(
            response.getEmergency().getRequester(),
            "Helper has arrived!",
            helper.getFullName() + " has arrived at your location",
            NotificationType.HELPER_ARRIVED,
            response.getEmergency()
        );

        return saved;
    }

    @Transactional
    public HelperResponse rejectRequest(Long emergencyId, String helperEmail) {
        User helper = findUser(helperEmail);

        HelperResponse response = helperResponseRepo
                .findByEmergencyIdAndHelperId(emergencyId, helper.getId())
                .orElseGet(() -> HelperResponse.builder()
                        .emergency(findEmergency(emergencyId))
                        .helper(helper)
                        .build());

        response.setStatus(ResponseStatus.REJECTED);
        return helperResponseRepo.save(response);
    }

    private User findUser(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    private EmergencyRequest findEmergency(Long id) {
        return emergencyRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyRequest", id));
    }
}
