package com.crowdaid.controller;

import com.crowdaid.dto.request.RatingRequest;
import com.crowdaid.dto.response.ApiResponse;
import com.crowdaid.service.impl.RatingServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Ratings", description = "Post-resolution ratings and feedback")
public class RatingController {

    private final RatingServiceImpl ratingService;

    @PostMapping
    @Operation(summary = "Submit a rating after emergency resolution")
    public ResponseEntity<ApiResponse<Void>> submit(
            @Valid @RequestBody RatingRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        ratingService.submitRating(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Rating submitted", null));
    }
}
