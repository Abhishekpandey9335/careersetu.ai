package com.careersetu.dto.company;

import lombok.Data;

@Data
public class CompanyDetailDto {
    private Long id;
    private String name;
    private String slug;
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
    private Integer readinessScore;
}