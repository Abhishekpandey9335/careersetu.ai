package com.careersetu.dto.ai;

import lombok.Builder;
import lombok.Data;

@Data @Builder
public class ResumeAnalysisResponse {
    private Long resumeId;
    private String fileName;
    private String reply;
}