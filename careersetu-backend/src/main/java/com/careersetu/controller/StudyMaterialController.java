package com.careersetu.controller;

import com.careersetu.dto.studymaterial.StudyMaterialDto;
import com.careersetu.entity.StudyMaterial;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.security.JwtUtil;
import com.careersetu.service.StudyMaterialService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/study-materials")
@RequiredArgsConstructor
@Tag(name = "Study Materials", description = "Notes, PYQs, mock tests, syllabi")
public class StudyMaterialController {

    private final StudyMaterialService studyMaterialService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    @Operation(summary = "Browse study materials with optional filters")
    public ResponseEntity<ApiResponse<Page<StudyMaterialDto>>> filter(
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false) StudyMaterial.MaterialType type,
            @RequestParam(required = false) Boolean premium,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                studyMaterialService.filter(examId, type, premium, page, size)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get material by ID. Premium materials require active subscription.")
    public ResponseEntity<ApiResponse<StudyMaterialDto>> getById(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Long userId = resolveOptionalUserId(authHeader);
        return ResponseEntity.ok(ApiResponse.success(studyMaterialService.getById(id, userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload a study material (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<StudyMaterialDto>> create(
            @RequestParam String title,
            @RequestParam(required = false) Long examId,
            @RequestParam(required = false) String subject,
            @RequestParam StudyMaterial.MaterialType type,
            @RequestParam String fileUrl,
            @RequestParam(defaultValue = "false") boolean isPremium) {
        Long uploaderId = userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
        return ResponseEntity.status(201).body(ApiResponse.success("Uploaded",
                studyMaterialService.create(title, examId, subject, type, fileUrl, isPremium, uploaderId)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete a study material (Admin only)", security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        studyMaterialService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }

    private Long resolveOptionalUserId(String authHeader) {
        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtil.isTokenValid(token)) {
                String email = jwtUtil.extractEmail(token);
                return userRepository.findByEmail(email).map(u -> u.getId()).orElse(null);
            }
        }
        return null;
    }
}
