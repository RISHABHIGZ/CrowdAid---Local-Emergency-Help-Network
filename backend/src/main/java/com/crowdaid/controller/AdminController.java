package com.crowdaid.controller;

import com.crowdaid.dto.response.AnalyticsResponse;
import com.crowdaid.dto.response.ApiResponse;
import com.crowdaid.dto.response.UserResponse;
import com.crowdaid.service.impl.AnalyticsServiceImpl;
import com.crowdaid.service.impl.UserServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin-only management and analytics")
public class AdminController {

    private final UserServiceImpl userService;
    private final AnalyticsServiceImpl analyticsService;

    @GetMapping("/analytics")
    @Operation(summary = "Get dashboard analytics")
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getDashboardAnalytics()));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users")
    public ResponseEntity<ApiResponse<Page<UserResponse>>> listUsers(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers(pageable)));
    }

    @PatchMapping("/users/{id}/ban")
    @Operation(summary = "Ban a user")
    public ResponseEntity<ApiResponse<Void>> banUser(@PathVariable Long id) {
        userService.toggleBan(id, true);
        return ResponseEntity.ok(ApiResponse.success("User banned", null));
    }

    @PatchMapping("/users/{id}/unban")
    @Operation(summary = "Unban a user")
    public ResponseEntity<ApiResponse<Void>> unbanUser(@PathVariable Long id) {
        userService.toggleBan(id, false);
        return ResponseEntity.ok(ApiResponse.success("User unbanned", null));
    }
}
