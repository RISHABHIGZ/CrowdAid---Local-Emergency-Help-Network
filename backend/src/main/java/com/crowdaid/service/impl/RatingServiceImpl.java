package com.crowdaid.service.impl;

import com.crowdaid.dto.request.RatingRequest;
import com.crowdaid.entity.EmergencyRequest;
import com.crowdaid.entity.Rating;
import com.crowdaid.entity.User;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.enums.NotificationType;
import com.crowdaid.exception.BadRequestException;
import com.crowdaid.exception.ResourceNotFoundException;
import com.crowdaid.repository.EmergencyRequestRepository;
import com.crowdaid.repository.RatingRepository;
import com.crowdaid.repository.UserRepository;
import com.crowdaid.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RatingServiceImpl {

    private final RatingRepository ratingRepo;
    private final UserRepository userRepo;
    private final EmergencyRequestRepository emergencyRepo;
    private final NotificationService notificationService;

    @Transactional
    public Rating submitRating(RatingRequest request, String raterEmail) {
        User rater = userRepo.findByEmail(raterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        User ratee = userRepo.findById(request.getRateeId())
                .orElseThrow(() -> new ResourceNotFoundException("User", request.getRateeId()));

        EmergencyRequest emergency = emergencyRepo.findById(request.getEmergencyId())
                .orElseThrow(() -> new ResourceNotFoundException("EmergencyRequest", request.getEmergencyId()));

        if (emergency.getStatus() != EmergencyStatus.RESOLVED) {
            throw new BadRequestException("Can only rate after emergency is resolved");
        }

        if (ratingRepo.existsByEmergencyIdAndRaterIdAndRateeId(
                request.getEmergencyId(), rater.getId(), request.getRateeId())) {
            throw new BadRequestException("You have already rated this user for this emergency");
        }

        Rating rating = Rating.builder()
                .emergency(emergency)
                .rater(rater)
                .ratee(ratee)
                .score(request.getScore())
                .comment(request.getComment())
                .build();

        Rating saved = ratingRepo.save(rating);

        // Recalculate trust score for the ratee
        updateTrustScore(ratee);

        // Notify the rated user
        notificationService.sendToUser(
            ratee,
            "You received a " + request.getScore() + "★ rating",
            rater.getFullName() + " rated you for: " + emergency.getTitle(),
            NotificationType.RATING_RECEIVED,
            emergency
        );

        return saved;
    }

    /**
     * Trust score algorithm — weighted blend of average rating × completion rate.
     * Score range: 0–100.
     */
    private void updateTrustScore(User user) {
        double avgRating = ratingRepo.findAverageScoreByRateeId(user.getId()).orElse(3.0);
        long   ratingCount = ratingRepo.countByRateeId(user.getId());

        // Normalize rating (1-5 scale) to 0-80 range
        double ratingComponent = ((avgRating - 1) / 4.0) * 80;

        // Experience bonus — more ratings = more trust (up to 20 points)
        double experienceBonus = Math.min(20.0, ratingCount * 2.0);

        double newScore = ratingComponent + experienceBonus;
        user.setTrustScore(Math.round(newScore * 10.0) / 10.0);
        userRepo.save(user);
    }
}
