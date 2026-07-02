package com.crowdaid.controller;

import com.crowdaid.dto.response.ApiResponse;
import com.crowdaid.service.impl.HelperResponseServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/helpers")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Helper Responses", description = "Helper accept/reject/arrival flow")
public class HelperController {

    private final HelperResponseServiceImpl helperResponseService;

    @PostMapping("/emergencies/{id}/accept")
    @PreAuthorize("hasRole('HELPER') or hasRole('ADMIN')")
    @Operation(summary = "Accept an emergency request")
    public ResponseEntity<ApiResponse<Void>> accept(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        helperResponseService.acceptRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("You are now helping with this emergency", null));
    }

    @PostMapping("/emergencies/{id}/reject")
    @PreAuthorize("hasRole('HELPER') or hasRole('ADMIN')")
    @Operation(summary = "Reject an emergency request")
    public ResponseEntity<ApiResponse<Void>> reject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        helperResponseService.rejectRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Request rejected", null));
    }

    @PostMapping("/emergencies/{id}/arrived")
    @PreAuthorize("hasRole('HELPER') or hasRole('ADMIN')")
    @Operation(summary = "Mark arrival at emergency location")
    public ResponseEntity<ApiResponse<Void>> markArrived(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        helperResponseService.markArrived(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Arrival confirmed", null));
    }
}
