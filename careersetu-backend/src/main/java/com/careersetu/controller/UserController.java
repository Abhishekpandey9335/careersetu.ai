package com.careersetu.controller;

import com.careersetu.dto.user.UpdateProfileRequest;
import com.careersetu.dto.user.UserProfileDto;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.UserService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "User Profile", description = "View and update student profile")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail())
                .orElseThrow().getId();
    }

    @GetMapping("/me")
    @Operation(summary = "Get current user's full profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> getMyProfile() {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile(currentUserId())));
    }

    @PutMapping("/me")
    @Operation(summary = "Update current user's profile")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateMyProfile(
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                userService.updateProfile(currentUserId(), request)));
    }

    @PatchMapping("/me/resume")
    @Operation(summary = "Set resume URL after S3/Cloudinary upload")
    public ResponseEntity<ApiResponse<UserProfileDto>> updateResume(@RequestParam String url) {
        return ResponseEntity.ok(ApiResponse.success("Resume updated",
                userService.updateResumeUrl(currentUserId(), url)));
    }
}
