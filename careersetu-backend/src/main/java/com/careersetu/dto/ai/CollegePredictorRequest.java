package com.careersetu.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CollegePredictorRequest {
    @NotBlank
    private String currentClass;    // "10th" or "12th"
    private Double percentage;
    private String stream;          // "Science", "Commerce", "Arts"
    private String careerGoal;      // e.g. "Software Engineer", "Doctor", "IAS"
    private String state;
    private String category;        // General/OBC/SC/ST
}
