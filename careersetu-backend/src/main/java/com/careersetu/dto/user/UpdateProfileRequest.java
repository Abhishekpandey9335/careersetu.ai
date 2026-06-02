package com.careersetu.dto.user;

import com.careersetu.entity.UserProfile;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;
import java.util.List;

@Data
public class UpdateProfileRequest {
    @Min(14) @Max(60)
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
}
