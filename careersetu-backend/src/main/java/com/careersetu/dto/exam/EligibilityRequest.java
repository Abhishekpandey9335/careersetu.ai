package com.careersetu.dto.exam;

import com.careersetu.entity.UserProfile;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EligibilityRequest {
    @NotNull @Min(14) @Max(60)
    private Integer age;

    @NotNull
    private UserProfile.Qualification qualification;

    private String stream;
    private String state;
    private String category; // General, OBC, SC, ST, EWS
}
