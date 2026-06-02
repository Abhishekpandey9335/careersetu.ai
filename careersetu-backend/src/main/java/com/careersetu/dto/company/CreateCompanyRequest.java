package com.careersetu.dto.company;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateCompanyRequest {
    @NotBlank private String name;
    @NotBlank private String slug;
    private String industry;
    private Integer foundedYear;
    private String hq;
    private String about;
    private Integer avgPackageFresher;
    private String website;
    private String logoUrl;
    private String aptitudeLevel;
    private String dsaLevel;
    private Integer codingRounds;
    private Integer hrRounds;
    private boolean hasSystemDesign;
    private String requiredSkills;
    private String interviewProcessJson;
    private String salaryByRoleJson;
    private String placementPapersUrl;
}