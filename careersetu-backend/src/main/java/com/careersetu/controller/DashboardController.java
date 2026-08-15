package com.careersetu.controller;

import com.careersetu.entity.Notification;
import com.careersetu.entity.UserApplication;
import com.careersetu.exception.ApiResponse;
import com.careersetu.repository.*;
import com.careersetu.service.*;
import com.careersetu.util.SecurityUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Aggregated student dashboard — profile, applications, notifications, bookmarks")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final UserRepository       userRepository;
    private final UserService          userService;
    private final ApplicationTrackerService applicationTrackerService;
    private final NotificationService  notificationService;
    private final BookmarkService      bookmarkService;
    private final JobService           jobService;

    private Long currentUserId() {
        return userRepository.findByEmail(SecurityUtil.getCurrentEmail()).orElseThrow().getId();
    }

    /**
     * Full dashboard snapshot — one API call for the entire frontend dashboard page.
     * GET /api/dashboard
     */
    @GetMapping
    @Operation(summary = "Full dashboard: profile + applications + notifications + bookmarks")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        Long userId = currentUserId();
        Map<String, Object> dashboard = new LinkedHashMap<>();

        // Profile summary
        dashboard.put("profile", userService.getProfile(userId));

        // Application tracker
        List<UserApplication> applications = applicationTrackerService.getUserApplications(userId);
        dashboard.put("applications", applications);
        dashboard.put("applicationStats", Map.of(
                "total",       applications.size(),
                "applied",     applications.stream().filter(a -> a.getStatus() == UserApplication.ApplicationStatus.APPLIED).count(),
                "underReview", applications.stream().filter(a -> a.getStatus() == UserApplication.ApplicationStatus.UNDER_REVIEW).count(),
                "selected",    applications.stream().filter(a -> a.getStatus() == UserApplication.ApplicationStatus.SELECTED).count(),
                "rejected",    applications.stream().filter(a -> a.getStatus() == UserApplication.ApplicationStatus.REJECTED).count()
        ));

        // Notifications (latest 10 unread)
        dashboard.put("unreadNotificationCount", notificationService.getUnreadCount(userId));
        dashboard.put("recentNotifications",
                notificationService.getForUser(userId, 0, 5).getContent());

        // Bookmarks
        dashboard.put("bookmarks", Map.of(
                "jobs",  bookmarkService.getUserBookmarks(userId, "JOB")
        ));

        return ResponseEntity.ok(ApiResponse.success(dashboard));
    }

    /**
     * Quick stats only — for top header cards.
     * GET /api/dashboard/stats
     */
    @GetMapping("/stats")
    @Operation(summary = "Quick stats: application counts, unread notifications, bookmark counts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        Long userId = currentUserId();
        List<UserApplication> apps = applicationTrackerService.getUserApplications(userId);
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalApplications",    apps.size());
        stats.put("selectedApplications", apps.stream().filter(a -> a.getStatus() == UserApplication.ApplicationStatus.SELECTED).count());
        stats.put("unreadNotifications",  notificationService.getUnreadCount(userId));
        stats.put("savedJobs",   bookmarkService.getUserBookmarks(userId, "JOB").size());
        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
