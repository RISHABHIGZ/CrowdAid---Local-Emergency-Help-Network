package com.crowdaid.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 100)
    private String fullName;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid phone number")
    private String phone;

    @Size(max = 300)
    private String address;

    private String profileImageUrl;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid emergency contact")
    private String emergencyContact;

    @DecimalMin("-90.0")  @DecimalMax("90.0")
    private Double latitude;

    @DecimalMin("-180.0") @DecimalMax("180.0")
    private Double longitude;

    private Boolean isAvailable;
}
