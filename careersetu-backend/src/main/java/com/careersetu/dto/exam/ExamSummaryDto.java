package com.careersetu.dto.exam;

import com.careersetu.entity.Exam;
import com.careersetu.entity.UserProfile;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExamSummaryDto {
    private Long id;
    private String name;
    private String slug;
    private Exam.ExamCategory category;
    private String conductingBody;
    private Integer vacancy;
    private LocalDate formStart;
    private LocalDate formEnd;
    private LocalDate examDate;
    private Exam.ExamStatus status;
    private String logoUrl;
    private Integer salaryMin;
    private Integer salaryMax;
    private UserProfile.Qualification minQualification;
    private String applicationFeeGeneral;
    private String officialApplyUrl;
    private LocalDateTime createdAt;
}
