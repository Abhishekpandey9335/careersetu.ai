package com.careersetu.dto.job;

import com.careersetu.entity.Job;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateJobRequest {
    private Long companyId;
    @NotBlank private String title;
    @NotNull  private Job.JobType type;
    private String location;
    private Integer salaryMin;
    private Integer salaryMax;
    private List<String> skillsRequired;
    private String qualification;
    private Integer experienceMin;
    private Integer experienceMax;
    private String applyLink;
    private LocalDate expiresAt;
}
