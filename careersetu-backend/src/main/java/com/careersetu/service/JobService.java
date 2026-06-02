package com.careersetu.service;

import com.careersetu.dto.job.CreateJobRequest;
import com.careersetu.dto.job.JobDto;
import com.careersetu.entity.*;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.CompanyRepository;
import com.careersetu.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public Page<JobDto> searchJobs(Job.JobType type, String location,
                                    Integer salaryMin, String search,
                                    int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "postedAt"));
        return jobRepository.searchJobs(type, location, salaryMin, search, pageable)
                .map(this::toDto);
    }

    public JobDto getById(Long id) {
        return toDto(jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job", id)));
    }

    public List<JobDto> getLatestByType(Job.JobType type, int limit) {
        return jobRepository.findTop6ByTypeAndStatusOrderByPostedAtDesc(type, Job.JobStatus.ACTIVE)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public JobDto createJob(CreateJobRequest req) {
        Company company = null;
        if (req.getCompanyId() != null) {
            company = companyRepository.findById(req.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException("Company", req.getCompanyId()));
        }

        Job job = Job.builder()
                .company(company).title(req.getTitle()).type(req.getType())
                .location(req.getLocation()).salaryMin(req.getSalaryMin())
                .salaryMax(req.getSalaryMax()).skillsRequired(req.getSkillsRequired())
                .qualification(req.getQualification())
                .experienceMin(req.getExperienceMin()).experienceMax(req.getExperienceMax())
                .applyLink(req.getApplyLink()).expiresAt(req.getExpiresAt())
                .build();
        return toDto(jobRepository.save(job));
    }

    @Transactional
    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) throw new ResourceNotFoundException("Job", id);
        jobRepository.deleteById(id);
    }

    public JobDto toDto(Job j) {
        JobDto dto = new JobDto();
        dto.setId(j.getId()); dto.setTitle(j.getTitle());
        dto.setType(j.getType()); dto.setLocation(j.getLocation());
        dto.setSalaryMin(j.getSalaryMin()); dto.setSalaryMax(j.getSalaryMax());
        dto.setSkillsRequired(j.getSkillsRequired());
        dto.setQualification(j.getQualification());
        dto.setExperienceMin(j.getExperienceMin()); dto.setExperienceMax(j.getExperienceMax());
        dto.setApplyLink(j.getApplyLink()); dto.setStatus(j.getStatus());
        dto.setPostedAt(j.getPostedAt()); dto.setExpiresAt(j.getExpiresAt());
        if (j.getCompany() != null) {
            dto.setCompanyId(j.getCompany().getId());
            dto.setCompanyName(j.getCompany().getName());
            dto.setCompanyLogo(j.getCompany().getLogoUrl());
        }
        return dto;
    }
}
