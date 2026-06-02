package com.careersetu.dto.job;

import com.careersetu.entity.Job;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class JobDto {
    private Long id;
    private Long companyId;
    private String companyName;
    private String companyLogo;
    private String title;
    private Job.JobType type;
    private String location;
    private Integer salaryMin;
    private Integer salaryMax;
    private Object skillsRequired;
    private String qualification;
    private Integer experienceMin;
    private Integer experienceMax;
    private String applyLink;
    private Job.JobStatus status;
    private LocalDateTime postedAt;
    private LocalDate expiresAt;
}