package com.careersetu.service;

import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationTrackerService {

    private final UserApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final JobRepository jobRepository;

    public List<UserApplication> getUserApplications(Long userId) {
        return applicationRepository.findByUserIdOrderByAppliedAtDesc(userId);
    }

    @Transactional
    public UserApplication trackJobApplication(Long userId, Long jobId, String notes) {
        if (applicationRepository.existsByUserIdAndJobId(userId, jobId))
            throw new BadRequestException("Already tracking this job application");

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", jobId));

        return applicationRepository.save(UserApplication.builder()
                .user(user).jobId(jobId)
                .entityType(UserApplication.ApplicationEntityType.JOB)
                .notes(notes).build());
    }

    @Transactional
    public UserApplication updateStatus(Long appId, Long userId, UserApplication.ApplicationStatus status) {
        UserApplication app = getOwnedApp(appId, userId);
        app.setStatus(status);
        app.setUpdatedAt(LocalDateTime.now());
        return applicationRepository.save(app);
    }

    @Transactional
    public void deleteApplication(Long appId, Long userId) {
        UserApplication app = getOwnedApp(appId, userId);
        applicationRepository.delete(app);
    }

    private UserApplication getOwnedApp(Long appId, Long userId) {
        UserApplication app = applicationRepository.findById(appId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", appId));
        if (!app.getUser().getId().equals(userId))
            throw new ResourceNotFoundException("Application", appId);
        return app;
    }
}
