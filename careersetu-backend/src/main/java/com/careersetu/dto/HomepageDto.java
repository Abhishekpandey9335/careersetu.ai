package com.careersetu.dto;

import com.careersetu.dto.exam.ExamSummaryDto;
import com.careersetu.dto.job.JobDto;
import com.careersetu.dto.roadmap.RoadmapDto;
import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class HomepageDto {
    private List<ExamSummaryDto> latestGovtExams;
    private List<JobDto> latestPrivateJobs;
    private List<JobDto> latestInternships;
    private List<ExamSummaryDto> upcomingDeadlines;
    private List<RoadmapDto> popularRoadmaps;
    private long totalExams;
    private long totalJobs;
    private long totalInternships;
    private long totalStudyMaterials;
}
