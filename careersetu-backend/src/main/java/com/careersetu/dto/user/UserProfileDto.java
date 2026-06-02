package com.careersetu.dto.user;

import com.careersetu.entity.UserProfile;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class UserProfileDto {
    private Long userId;
    private String name;
    private String email;
    private String phone;
    private boolean isPremium;
    private LocalDateTime premiumExpiry;
    // Profile fields
    private Integer age;
    private UserProfile.Qualification qualification;
    private String stream;
    private String state;
    private String category;
    private List<String> skills;
    private String goal;
    private Integer expectedSalary;
    private UserProfile.PreferredMode preferredMode;
    private String aboutMe;
    private String linkedinUrl;
    private String resumeUrl;
}
