package com.crowdaid.service.impl;

import com.crowdaid.dto.request.UpdateProfileRequest;
import com.crowdaid.dto.response.UserResponse;
import com.crowdaid.entity.User;
import com.crowdaid.exception.ResourceNotFoundException;
import com.crowdaid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl {

    private final UserRepository userRepo;

    @Transactional(readOnly = true)
    public UserResponse getProfile(String email) {
        return toResponse(findByEmail(email));
    }

    @Transactional(readOnly = true)
    public UserResponse getById(Long id) {
        return toResponse(userRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id)));
    }

    @Transactional
    public UserResponse updateProfile(String email, UpdateProfileRequest req) {
        User user = findByEmail(email);

        if (req.getFullName()        != null) user.setFullName(req.getFullName());
        if (req.getPhone()           != null) user.setPhone(req.getPhone());
        if (req.getAddress()         != null) user.setAddress(req.getAddress());
        if (req.getProfileImageUrl() != null) user.setProfileImageUrl(req.getProfileImageUrl());
        if (req.getEmergencyContact()!= null) user.setEmergencyContact(req.getEmergencyContact());
        if (req.getLatitude()        != null) user.setLatitude(req.getLatitude());
        if (req.getLongitude()       != null) user.setLongitude(req.getLongitude());
        if (req.getIsAvailable()     != null) user.setIsAvailable(req.getIsAvailable());

        return toResponse(userRepo.save(user));
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepo.findByIsActiveTrue(pageable).map(this::toResponse);
    }

    @Transactional
    public void toggleBan(Long userId, boolean ban) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setIsActive(!ban);
        userRepo.save(user);
    }

    private User findByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email));
    }

    public UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .profileImageUrl(u.getProfileImageUrl())
                .address(u.getAddress())
                .latitude(u.getLatitude())
                .longitude(u.getLongitude())
                .trustScore(u.getTrustScore())
                .isVerified(u.getIsVerified())
                .isAvailable(u.getIsAvailable())
                .roles(u.getRoles().stream().map(r -> r.getName().name()).collect(Collectors.toSet()))
                .createdAt(u.getCreatedAt())
                .build();
    }
}
