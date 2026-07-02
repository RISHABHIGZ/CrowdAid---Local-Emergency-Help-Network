package com.crowdaid.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImageUrl;
    private String address;
    private Double latitude;
    private Double longitude;
    private Double trustScore;
    private Boolean isVerified;
    private Boolean isAvailable;
    private Set<String> roles;
    private LocalDateTime createdAt;
}
