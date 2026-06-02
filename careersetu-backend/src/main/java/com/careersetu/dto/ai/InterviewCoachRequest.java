package com.careersetu.dto.ai;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InterviewCoachRequest {
    @NotBlank
    private String targetRole;       // e.g. "TCS Software Engineer", "IBPS PO"
    private String round;            // "aptitude" | "technical" | "hr" (default: technical)
    private String previousAnswer;   // user's answer to last question (null for first question)
    private String previousQuestion; // for follow-up evaluation
}
