package com.careersetu.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SalaryPredictorRequest {
    @NotBlank
    private String careerPath;       // e.g. "Data Analyst", "SSC CGL Officer"
    private String location;         // e.g. "Delhi", "Mumbai"
    private int currentExperience;   // years (0 for fresher)
}
