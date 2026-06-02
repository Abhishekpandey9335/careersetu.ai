package com.careersetu.dto.exam;

import com.careersetu.entity.Exam;
import com.careersetu.entity.UserProfile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateExamRequest {
    @NotBlank private String name;
    @NotBlank private String slug;
    @NotNull  private Exam.ExamCategory category;
    private String conductingBody;
    private Integer minAge;
    private Integer maxAge;
    @NotNull private UserProfile.Qualification minQualification;
    private List<String> allowedStreams;
    private String categoryRelaxations;
    private Integer vacancy;
    private LocalDate formStart;
    private LocalDate formEnd;
    private LocalDate examDate;
    private LocalDate resultDate;
    private String officialNotificationUrl;
    private String officialApplyUrl;
    private String logoUrl;
    private Integer salaryMin;
    private Integer salaryMax;
    private String applicationFeeGeneral;
    private String applicationFeeReserved;
    private String syllabusJson;
    private String selectionProcessJson;
    private String eligibilityJson;
    private String salaryJson;
    private String booksJson;
    private String preparationTips;
    private String previousCutoffs;
    private String faq;
}