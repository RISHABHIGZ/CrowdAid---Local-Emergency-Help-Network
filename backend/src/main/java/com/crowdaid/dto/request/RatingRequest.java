package com.crowdaid.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RatingRequest {

    @NotNull
    private Long emergencyId;

    @NotNull
    private Long rateeId;

    @NotNull @Min(1) @Max(5)
    private Integer score;

    @Size(max = 1000)
    private String comment;
}
