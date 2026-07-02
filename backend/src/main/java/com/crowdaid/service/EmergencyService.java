package com.crowdaid.service;

import com.crowdaid.dto.request.EmergencyRequestDto;
import com.crowdaid.dto.response.EmergencyResponse;
import com.crowdaid.enums.EmergencyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EmergencyService {
    EmergencyResponse createRequest(EmergencyRequestDto dto, String requesterEmail);
    EmergencyResponse getById(Long id);
    Page<EmergencyResponse> getAll(Pageable pageable);
    Page<EmergencyResponse> getByStatus(EmergencyStatus status, Pageable pageable);
    Page<EmergencyResponse> getMyRequests(String email, Pageable pageable);
    EmergencyResponse updateStatus(Long id, EmergencyStatus status, String email);
    void deleteRequest(Long id, String email);
}
