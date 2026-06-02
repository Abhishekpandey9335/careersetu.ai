package com.careersetu.controller;

import com.careersetu.entity.UserApplication;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.ApplicationTrackerService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
@Tag(name = "Application Tracker", description = "Track submitted job and exam applications")
@SecurityRequirement(name = "bearerAuth")
public class ApplicationTrackerController {

    private final ApplicationTrackerService trackerService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    @GetMapping
    @Operation(summary = "Get all tracked applications for current user")
    public ResponseEntity<ApiResponse<List<UserApplication>>> getMyApplications() {
        return ResponseEntity.ok(ApiResponse.success(
                trackerService.getUserApplications(currentUserId())));
    }

    @PostMapping("/jobs/{jobId}")
    @Operation(summary = "Track a new job application")
    public ResponseEntity<ApiResponse<UserApplication>> trackJob(
            @PathVariable Long jobId,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.status(201).body(ApiResponse.success("Tracked",
                trackerService.trackJobApplication(currentUserId(), jobId, notes)));
    }

    @PostMapping("/exams/{examId}")
    @Operation(summary = "Track a new exam application")
    public ResponseEntity<ApiResponse<UserApplication>> trackExam(
            @PathVariable Long examId,
            @RequestParam(required = false) String notes) {
        return ResponseEntity.status(201).body(ApiResponse.success("Tracked",
                trackerService.trackExamApplication(currentUserId(), examId, notes)));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update the status of a tracked application")
    public ResponseEntity<ApiResponse<UserApplication>> updateStatus(
            @PathVariable Long id,
            @RequestParam UserApplication.ApplicationStatus status) {
        return ResponseEntity.ok(ApiResponse.success("Updated",
                trackerService.updateStatus(id, currentUserId(), status)));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remove a tracked application")
    public ResponseEntity<ApiResponse<Void>> deleteApplication(@PathVariable Long id) {
        trackerService.deleteApplication(id, currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
