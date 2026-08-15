package com.careersetu.service;

import com.careersetu.dto.roadmap.RoadmapDto;
import com.careersetu.entity.*;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final RoadmapRepository roadmapRepository;

    public RoadmapDto getBySlug(String slug) {
        return toDto(roadmapRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Roadmap", "slug", slug)));
    }

    public List<RoadmapDto> getPopular() {
        return roadmapRepository.findTop6ByOrderByIdAsc()
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    public RoadmapDto save(String title, String slug,
                            Integer durationWeeks, Roadmap.Difficulty difficulty,
                            Double successRate, Object planJson, User createdBy) {
        Roadmap roadmap = Roadmap.builder()
                .title(title).slug(slug)
                .durationWeeks(durationWeeks).difficulty(difficulty)
                .successRate(successRate).planJson(planJson).createdBy(createdBy)
                .build();
        return toDto(roadmapRepository.save(roadmap));
    }

    private RoadmapDto toDto(Roadmap r) {
        RoadmapDto dto = new RoadmapDto();
        dto.setId(r.getId()); dto.setTitle(r.getTitle()); dto.setSlug(r.getSlug());
        dto.setDurationWeeks(r.getDurationWeeks()); dto.setDifficulty(r.getDifficulty());
        dto.setSuccessRate(r.getSuccessRate()); dto.setPlanJson(r.getPlanJson());
        return dto;
    }
}
