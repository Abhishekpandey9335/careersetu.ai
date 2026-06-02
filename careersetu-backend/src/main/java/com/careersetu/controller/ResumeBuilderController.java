package com.careersetu.controller;

import com.careersetu.dto.user.UserProfileDto;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.AiService;
import com.careersetu.service.UserService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Resume Builder — ATS templates + AI review.
 * Actual PDF generation is handled by frontend (or a separate Python service).
 * This controller provides: template listing, AI resume review, ATS tips.
 */
@RestController
@RequestMapping("/resume")
@RequiredArgsConstructor
@Tag(name = "Resume Builder", description = "ATS-friendly templates and AI resume review")
@SecurityRequirement(name = "bearerAuth")
public class ResumeBuilderController {

    private final UserService  userService;
    private final AiService    aiService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    /** List available resume templates */
    @GetMapping("/templates")
    @Operation(summary = "Get list of available ATS resume templates")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getTemplates() {
        List<Map<String, Object>> templates = List.of(
                Map.of("id", "classic", "name", "Classic ATS",
                        "description", "Clean single-column, maximum ATS compatibility",
                        "bestFor", "Govt jobs, PSU applications", "isPremium", false),
                Map.of("id", "modern", "name", "Modern Professional",
                        "description", "Two-column with subtle color, high readability",
                        "bestFor", "Private sector, MNC applications", "isPremium", false),
                Map.of("id", "tech", "name", "Tech Focused",
                        "description", "Skills-first layout with project highlights",
                        "bestFor", "Software engineers, Data analysts", "isPremium", true),
                Map.of("id", "fresher", "name", "Fresher Optimised",
                        "description", "Education and projects front and center",
                        "bestFor", "Recent graduates, campus placements", "isPremium", false)
        );
        return ResponseEntity.ok(ApiResponse.success(templates));
    }

    /**
     * Get auto-populated resume data from user profile.
     * Frontend uses this to pre-fill the resume form.
     */
    @GetMapping("/prefill")
    @Operation(summary = "Get user profile data pre-formatted for resume builder")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPrefillData() {
        Long userId = currentUserId();
        UserProfileDto profile = userService.getProfile(userId);

        Map<String, Object> resumeData = Map.of(
                "fullName",    profile.getName() != null ? profile.getName() : "",
                "email",       profile.getEmail() != null ? profile.getEmail() : "",
                "phone",       profile.getPhone() != null ? profile.getPhone() : "",
                "qualification", profile.getQualification() != null ? profile.getQualification() : "",
                "skills",      profile.getSkills() != null ? profile.getSkills() : List.of(),
                "goal",        profile.getGoal() != null ? profile.getGoal() : "",
                "state",       profile.getState() != null ? profile.getState() : "",
                "resumeUrl",   profile.getResumeUrl() != null ? profile.getResumeUrl() : ""
        );
        return ResponseEntity.ok(ApiResponse.success(resumeData));
    }

    /**
     * AI Resume Review — paste resume text, get improvement suggestions.
     * POST /api/resume/review
     * Body: { "resumeText": "...", "targetRole": "Data Analyst at TCS" }
     */
    @PostMapping("/review")
    @Operation(summary = "AI reviews your resume and gives ATS optimisation tips (Premium)")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reviewResume(
            @RequestBody Map<String, String> body) {

        Long userId    = currentUserId();
        String resumeText  = body.getOrDefault("resumeText", "");
        String targetRole  = body.getOrDefault("targetRole", "Software Engineer");

        String prompt = String.format(
                "Review this resume for an Indian job seeker targeting: %s\\n\\n" +
                "RESUME:\\n%s\\n\\n" +
                "Provide:\\n" +
                "1. ATS Score (X/100) with reasoning\\n" +
                "2. What's good (keep these)\\n" +
                "3. Critical issues to fix (priority order)\\n" +
                "4. Missing keywords for this role\\n" +
                "5. Rewrite suggestion for the summary/objective section\\n" +
                "6. 5 specific action verbs to add\\n" +
                "7. Final tips for Indian HR screening",
                targetRole, resumeText.length() > 3000 ? resumeText.substring(0, 3000) : resumeText);

        com.careersetu.dto.ai.AiChatResponse aiReview = aiService.reviewResumeViaAi(prompt);

        return ResponseEntity.ok(ApiResponse.success(Map.of(
                "targetRole",  targetRole,
                "aiReview",    aiReview.getReply(),
                "tip",         "Update your resume URL after making changes via PATCH /api/users/me/resume"
        )));
    }
}
