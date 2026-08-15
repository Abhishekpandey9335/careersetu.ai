package com.careersetu.service;

import com.careersetu.dto.HomepageDto;
import com.careersetu.entity.Job;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HomepageService {

    private final JobService jobService;
    private final RoadmapService roadmapService;
    private final JobRepository jobRepository;
    private final StudyMaterialRepository studyMaterialRepository;

    public HomepageDto getHomepageData() {
        long totalInternships = jobRepository.countByType(Job.JobType.INTERNSHIP);

        return HomepageDto.builder()
                .latestPrivateJobs(jobService.getLatestByType(Job.JobType.PRIVATE, 6))
                .latestInternships(jobService.getLatestByType(Job.JobType.INTERNSHIP, 6))
                .popularRoadmaps(roadmapService.getPopular())
                .totalJobs(jobRepository.count())
                .totalInternships(totalInternships)
                .totalStudyMaterials(studyMaterialRepository.count())
                .build();
    }
}
