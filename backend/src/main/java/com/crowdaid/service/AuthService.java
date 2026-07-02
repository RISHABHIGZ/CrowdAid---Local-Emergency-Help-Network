package com.crowdaid.service;

import com.crowdaid.dto.request.LoginRequest;
import com.crowdaid.dto.request.RegisterRequest;
import com.crowdaid.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(String refreshToken);
}
