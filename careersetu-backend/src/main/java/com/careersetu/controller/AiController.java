package com.careersetu.controller;

import com.careersetu.dto.ai.AiChatRequest;
import com.careersetu.dto.ai.AiChatResponse;
import com.careersetu.dto.ai.RoadmapGenerateRequest;
import com.careersetu.entity.AiConversation;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.AiService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@Tag(name = "AI Career Advisor", description = "Chat, roadmap generation, skill gap analysis")
@SecurityRequirement(name = "bearerAuth")
public class AiController {

    private final AiService aiService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    @PostMapping("/chat")
    @Operation(summary = "Chat with AI Career Advisor. Pass conversationId to continue a thread.")
    public ResponseEntity<ApiResponse<AiChatResponse>> chat(@Valid @RequestBody AiChatRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.chat(currentUserId(), request)));
    }

    @PostMapping("/roadmap")
    @Operation(summary = "Generate a personalised study roadmap for an exam or career goal")
    public ResponseEntity<ApiResponse<AiChatResponse>> generateRoadmap(
            @Valid @RequestBody RoadmapGenerateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.generateRoadmap(currentUserId(), request)));
    }

    @GetMapping("/skill-gap")
    @Operation(summary = "Analyse skill gap against a target role (e.g. 'Data Analyst at TCS')")
    public ResponseEntity<ApiResponse<AiChatResponse>> skillGap(@RequestParam String targetRole) {
        return ResponseEntity.ok(ApiResponse.success(aiService.analyzeSkillGap(currentUserId(), targetRole)));
    }

    @GetMapping("/conversations")
    @Operation(summary = "Fetch saved conversation history (last 20)")
    public ResponseEntity<ApiResponse<List<AiConversation>>> getConversations() {
        return ResponseEntity.ok(ApiResponse.success(aiService.getUserConversations(currentUserId())));
    }

    @DeleteMapping("/conversations/{id}")
    @Operation(summary = "Delete a saved conversation")
    public ResponseEntity<ApiResponse<Void>> deleteConversation(@PathVariable Long id) {
        aiService.deleteConversation(id, currentUserId());
        return ResponseEntity.ok(ApiResponse.success("Conversation deleted", null));
    }

    @PostMapping("/salary-predictor")
    @Operation(summary = "Predict salary at 1yr, 3yr, 5yr for a career path")
    public ResponseEntity<ApiResponse<AiChatResponse>> predictSalary(
            @Valid @RequestBody com.careersetu.dto.ai.SalaryPredictorRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.predictSalary(currentUserId(), request)));
    }

    @GetMapping("/career-guidance")
    @Operation(summary = "Get top 5 personalised career path recommendations")
    public ResponseEntity<ApiResponse<AiChatResponse>> careerGuidance() {
        return ResponseEntity.ok(ApiResponse.success(aiService.getCareerGuidance(currentUserId())));
    }

    @PostMapping("/college-predictor")
    @Operation(summary = "Predict best stream/college for Class 10 or 12 students")
    public ResponseEntity<ApiResponse<AiChatResponse>> collegePredictor(
            @Valid @RequestBody com.careersetu.dto.ai.CollegePredictorRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.predictCollegeOrStream(currentUserId(), request)));
    }

    @PostMapping("/interview-coach")
    @Operation(summary = "AI Mock Interview — ask questions, evaluate answers, give feedback")
    public ResponseEntity<ApiResponse<AiChatResponse>> interviewCoach(
            @Valid @RequestBody com.careersetu.dto.ai.InterviewCoachRequest request) {
        return ResponseEntity.ok(ApiResponse.success(aiService.conductMockInterview(currentUserId(), request)));
    }

    @GetMapping("/career-gps")
    @Operation(summary = "Career GPS — step-by-step path to reach target salary in N years")
    public ResponseEntity<ApiResponse<AiChatResponse>> careerGps(
            @RequestParam String targetSalary,
            @RequestParam(defaultValue = "2") int targetYears) {
        return ResponseEntity.ok(ApiResponse.success(aiService.getCareerGps(currentUserId(), targetSalary, targetYears)));
    }

}
