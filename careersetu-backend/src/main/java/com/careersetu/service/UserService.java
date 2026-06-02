package com.careersetu.service;

import com.careersetu.dto.user.UpdateProfileRequest;
import com.careersetu.dto.user.UserProfileDto;
import com.careersetu.entity.*;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfileDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        return toDto(user, profile);
    }

    @Transactional
    public UserProfileDto updateProfile(Long userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(UserProfile.builder().user(user).build());

        if (req.getAge() != null) profile.setAge(req.getAge());
        if (req.getQualification() != null) profile.setQualification(req.getQualification());
        if (req.getStream() != null) profile.setStream(req.getStream());
        if (req.getState() != null) profile.setState(req.getState());
        if (req.getCategory() != null) profile.setCategory(req.getCategory());
        if (req.getSkills() != null) profile.setSkills(req.getSkills());
        if (req.getGoal() != null) profile.setGoal(req.getGoal());
        if (req.getExpectedSalary() != null) profile.setExpectedSalary(req.getExpectedSalary());
        if (req.getPreferredMode() != null) profile.setPreferredMode(req.getPreferredMode());
        if (req.getAboutMe() != null) profile.setAboutMe(req.getAboutMe());
        if (req.getLinkedinUrl() != null) profile.setLinkedinUrl(req.getLinkedinUrl());

        userProfileRepository.save(profile);
        return toDto(user, profile);
    }

    @Transactional
    public UserProfileDto updateResumeUrl(Long userId, String url) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(UserProfile.builder().user(user).build());
        profile.setResumeUrl(url);
        userProfileRepository.save(profile);
        return toDto(user, profile);
    }

    private UserProfileDto toDto(User user, UserProfile profile) {
        UserProfileDto dto = new UserProfileDto();
        dto.setUserId(user.getId()); dto.setName(user.getName());
        dto.setEmail(user.getEmail()); dto.setPhone(user.getPhone());
        dto.setPremium(user.isPremium()); dto.setPremiumExpiry(user.getPremiumExpiry());
        if (profile != null) {
            dto.setAge(profile.getAge()); dto.setQualification(profile.getQualification());
            dto.setStream(profile.getStream()); dto.setState(profile.getState());
            dto.setCategory(profile.getCategory()); dto.setSkills(profile.getSkills());
            dto.setGoal(profile.getGoal()); dto.setExpectedSalary(profile.getExpectedSalary());
            dto.setPreferredMode(profile.getPreferredMode()); dto.setAboutMe(profile.getAboutMe());
            dto.setLinkedinUrl(profile.getLinkedinUrl()); dto.setResumeUrl(profile.getResumeUrl());
        }
        return dto;
    }
}
