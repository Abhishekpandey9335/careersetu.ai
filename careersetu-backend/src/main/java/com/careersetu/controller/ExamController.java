package com.careersetu.controller;

import com.careersetu.dto.exam.*;
import com.careersetu.entity.Exam;
import com.careersetu.exception.ApiResponse;
import com.careersetu.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/exams")
@RequiredArgsConstructor
@Tag(name = "Exams", description = "Government exam listings, details, eligibility checker")
public class ExamController {

    private final ExamService examService;

    @GetMapping
    @Operation(summary = "Search and filter exams")
    public ResponseEntity<ApiResponse<Page<ExamSummaryDto>>> searchExams(
            @RequestParam(required = false) Exam.ExamCategory category,
            @RequestParam(required = false) Exam.ExamStatus status,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy) {
        return ResponseEntity.ok(ApiResponse.success(
                examService.searchExams(category, status, search, page, size, sortBy)));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get full exam details by slug")
    public ResponseEntity<ApiResponse<ExamDetailDto>> getExam(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(examService.getBySlug(slug)));
    }

    @PostMapping("/eligibility-check")
    @Operation(summary = "Check eligible exams based on age, qualification, stream")
    public ResponseEntity<ApiResponse<List<ExamSummaryDto>>> checkEligibility(
            @Valid @RequestBody EligibilityRequest request) {
        return ResponseEntity.ok(ApiResponse.success(examService.checkEligibility(request)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new exam (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ExamDetailDto>> createExam(@Valid @RequestBody CreateExamRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.success("Exam created", examService.createExam(request)));
    }

    @GetMapping("/calendar")
    @Operation(summary = "Get exam calendar for a given month (year & month params)")
    public ResponseEntity<ApiResponse<List<ExamSummaryDto>>> getCalendar(
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(ApiResponse.success(examService.getCalendar(year, month)));
    }

    @GetMapping("/upcoming")
    @Operation(summary = "Get upcoming exam events in next N days (default 30)")
    public ResponseEntity<ApiResponse<List<ExamSummaryDto>>> getUpcoming(
            @RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(ApiResponse.success(examService.getUpcoming(days)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update exam status (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<ExamSummaryDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam Exam.ExamStatus status) {
        return ResponseEntity.ok(ApiResponse.success(examService.updateStatus(id, status)));
    }
}
