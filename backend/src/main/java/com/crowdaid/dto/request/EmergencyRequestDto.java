package com.crowdaid.dto.request;

import com.crowdaid.enums.EmergencyCategory;
import com.crowdaid.enums.UrgencyLevel;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class EmergencyRequestDto {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 2000)
    private String description;

    @NotNull(message = "Category is required")
    private EmergencyCategory category;

    @NotNull(message = "Urgency level is required")
    private UrgencyLevel urgencyLevel;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0")  @DecimalMax(value = "90.0")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0") @DecimalMax(value = "180.0")
    private Double longitude;

    private String address;

    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$", message = "Invalid contact number")
    private String contactNumber;

    @Min(1) @Max(50)
    private Integer requiredHelpers = 1;
}
