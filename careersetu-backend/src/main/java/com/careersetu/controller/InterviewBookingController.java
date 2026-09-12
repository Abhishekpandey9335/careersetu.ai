package com.careersetu.controller;

import com.careersetu.entity.InterviewBooking;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.InterviewBookingService;
import com.careersetu.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interview-bookings")
@RequiredArgsConstructor
public class InterviewBookingController {

    private final InterviewBookingService interviewBookingService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> submitBooking(
            @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(ApiResponse.success(
                interviewBookingService.submitBooking(
                        currentUserId(),
                        request.get("interviewType"),
                        request.get("transactionId"),
                        request.get("screenshotUrl")
                )));
    }

    @GetMapping("/history")
    public ResponseEntity<ApiResponse<List<InterviewBooking>>> getHistory() {
        return ResponseEntity.ok(ApiResponse.success(
                interviewBookingService.getUserBookings(currentUserId())));
    }
}