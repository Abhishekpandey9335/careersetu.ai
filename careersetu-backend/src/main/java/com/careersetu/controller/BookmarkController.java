package com.careersetu.controller;

import com.careersetu.entity.Bookmark;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.UserRepository;
import com.careersetu.service.BookmarkService;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookmarks")
@RequiredArgsConstructor
@Tag(name = "Bookmarks", description = "Save/unsave exams and jobs for later")
@SecurityRequirement(name = "bearerAuth")
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final UserRepository userRepository;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    /** Toggle bookmark on/off. entityType = EXAM or JOB */
    @PostMapping("/{entityType}/{entityId}")
    @Operation(summary = "Toggle bookmark for an exam or job")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggle(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        return ResponseEntity.ok(ApiResponse.success(
                bookmarkService.toggle(currentUserId(), entityType.toUpperCase(), entityId)));
    }

    /** Check if a specific entity is bookmarked */
    @GetMapping("/{entityType}/{entityId}")
    @Operation(summary = "Check if an exam or job is bookmarked")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> check(
            @PathVariable String entityType,
            @PathVariable Long entityId) {
        boolean saved = bookmarkService.isBookmarked(currentUserId(), entityType.toUpperCase(), entityId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("bookmarked", saved)));
    }

    /** Get all bookmarks; optionally filter by type */
    @GetMapping
    @Operation(summary = "Get all bookmarks. Optional ?type=EXAM or ?type=JOB")
    public ResponseEntity<ApiResponse<List<Bookmark>>> getAll(
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(ApiResponse.success(
                bookmarkService.getUserBookmarks(currentUserId(), type != null ? type.toUpperCase() : null)));
    }
}
