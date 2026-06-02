package com.careersetu.dto.ai;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RoadmapGenerateRequest {
    @NotBlank
    private String examOrGoal; // "SSC CGL", "Data Analyst at TCS", etc.

    @Min(4) @Max(52)
    private Integer durationWeeks;

    @Min(1) @Max(12)
    private Integer hoursPerDay;
}
