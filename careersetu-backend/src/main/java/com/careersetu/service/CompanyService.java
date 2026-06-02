package com.careersetu.service;

import com.careersetu.dto.company.CompanyDetailDto;
import com.careersetu.dto.company.CompanySummaryDto;
import com.careersetu.dto.company.CreateCompanyRequest;
import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.CompanyRepository;
import com.careersetu.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserProfileRepository userProfileRepository;

    public Page<CompanySummaryDto> searchCompanies(String industry, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name"));
        return companyRepository.searchCompanies(industry, search, pageable)
                .map(this::toSummaryDto);
    }

    public CompanyDetailDto getBySlug(String slug, Long userId) {
        Company company = companyRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "slug", slug));
        CompanyDetailDto dto = toDetailDto(company);

        if (userId != null) {
            userProfileRepository.findByUserId(userId).ifPresent(profile -> {
                dto.setReadinessScore(computeReadinessScore(profile, company));
            });
        }
        return dto;
    }

    @Transactional
    public CompanyDetailDto createCompany(CreateCompanyRequest req) {
        if (companyRepository.findBySlug(req.getSlug()).isPresent()) {
            throw new BadRequestException("Company with slug '" + req.getSlug() + "' already exists");
        }

        Company company = Company.builder()
                .name(req.getName()).slug(req.getSlug()).industry(req.getIndustry())
                .foundedYear(req.getFoundedYear()).hq(req.getHq()).about(req.getAbout())
                .avgPackageFresher(req.getAvgPackageFresher())
                .website(req.getWebsite()).logoUrl(req.getLogoUrl())
                .build();

        CompanyPrep prep = CompanyPrep.builder()
                .company(company)
                .aptitudeLevel(req.getAptitudeLevel()).dsaLevel(req.getDsaLevel())
                .codingRounds(req.getCodingRounds()).hrRounds(req.getHrRounds())
                .hasSystemDesign(req.isHasSystemDesign())
                .requiredSkills(req.getRequiredSkills())
                .interviewProcessJson(req.getInterviewProcessJson())
                .salaryByRoleJson(req.getSalaryByRoleJson())
                .placementPapersUrl(req.getPlacementPapersUrl())
                .build();
        company.setPrep(prep);
        company = companyRepository.save(company);
        return toDetailDto(company);
    }

    @SuppressWarnings("unchecked")
    private int computeReadinessScore(UserProfile profile, Company company) {
        if (company.getPrep() == null) return 0;

        String rawSkills = company.getPrep().getRequiredSkills();
        if (rawSkills == null) return 100;

        List<String> required;
        try {
            required = new com.fasterxml.jackson.databind.ObjectMapper()
                    .readValue(rawSkills, new com.fasterxml.jackson.core.type.TypeReference<List<String>>() {});
        } catch (Exception e) {
            return 0;
        }

        if (required.isEmpty()) return 100;
        if (profile.getSkills() == null || profile.getSkills().isEmpty()) return 0;

        long matched = profile.getSkills().stream()
                .filter(s -> required.stream().anyMatch(r -> r.equalsIgnoreCase(s)))
                .count();
        return (int) ((matched * 100) / required.size());
    }
    private CompanySummaryDto toSummaryDto(Company c) {
        CompanySummaryDto dto = new CompanySummaryDto();
        dto.setId(c.getId()); dto.setName(c.getName()); dto.setSlug(c.getSlug());
        dto.setIndustry(c.getIndustry()); dto.setFoundedYear(c.getFoundedYear());
        dto.setHq(c.getHq()); dto.setAvgPackageFresher(c.getAvgPackageFresher());
        dto.setWebsite(c.getWebsite()); dto.setLogoUrl(c.getLogoUrl());
        return dto;
    }

    private CompanyDetailDto toDetailDto(Company c) {
        CompanyDetailDto dto = new CompanyDetailDto();
        dto.setId(c.getId()); dto.setName(c.getName()); dto.setSlug(c.getSlug());
        dto.setIndustry(c.getIndustry()); dto.setFoundedYear(c.getFoundedYear());
        dto.setHq(c.getHq()); dto.setAbout(c.getAbout());
        dto.setAvgPackageFresher(c.getAvgPackageFresher());
        dto.setWebsite(c.getWebsite()); dto.setLogoUrl(c.getLogoUrl());
        if (c.getPrep() != null) {
            CompanyPrep p = c.getPrep();
            dto.setAptitudeLevel(p.getAptitudeLevel()); dto.setDsaLevel(p.getDsaLevel());
            dto.setCodingRounds(p.getCodingRounds()); dto.setHrRounds(p.getHrRounds());
            dto.setHasSystemDesign(p.isHasSystemDesign());
            dto.setRequiredSkills(p.getRequiredSkills());
            dto.setInterviewProcessJson(p.getInterviewProcessJson());
            dto.setSalaryByRoleJson(p.getSalaryByRoleJson());
            dto.setPlacementPapersUrl(p.getPlacementPapersUrl());
        }
        return dto;
    }
}



