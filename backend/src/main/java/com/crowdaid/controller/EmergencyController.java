package com.crowdaid.controller;

import com.crowdaid.dto.request.EmergencyRequestDto;
import com.crowdaid.dto.response.ApiResponse;
import com.crowdaid.dto.response.EmergencyResponse;
import com.crowdaid.enums.EmergencyStatus;
import com.crowdaid.service.EmergencyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emergencies")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Emergency Requests", description = "Create and manage emergency help requests")
public class EmergencyController {

    private final EmergencyService emergencyService;

    @PostMapping
    @Operation(summary = "Create a new emergency request")
    public ResponseEntity<ApiResponse<EmergencyResponse>> create(
            @Valid @RequestBody EmergencyRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.success("Emergency request created",
                        emergencyService.createRequest(dto, userDetails.getUsername())));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get emergency request by ID")
    public ResponseEntity<ApiResponse<EmergencyResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(emergencyService.getById(id)));
    }

    @GetMapping
    @Operation(summary = "Get all emergency requests (paginated)")
    public ResponseEntity<ApiResponse<Page<EmergencyResponse>>> getAll(
            @PageableDefault(size = 10, sort = "createdAt") Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(emergencyService.getAll(pageable)));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Get emergency requests by status")
    public ResponseEntity<ApiResponse<Page<EmergencyResponse>>> getByStatus(
            @PathVariable EmergencyStatus status,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(emergencyService.getByStatus(status, pageable)));
    }

    @GetMapping("/my")
    @Operation(summary = "Get my emergency requests")
    public ResponseEntity<ApiResponse<Page<EmergencyResponse>>> getMyRequests(
            @AuthenticationPrincipal UserDetails userDetails,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(
                emergencyService.getMyRequests(userDetails.getUsername(), pageable)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update emergency request status")
    public ResponseEntity<ApiResponse<EmergencyResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam EmergencyStatus status,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success("Status updated",
                emergencyService.updateStatus(id, status, userDetails.getUsername())));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an emergency request")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        emergencyService.deleteRequest(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Request deleted", null));
    }
}
