package com.careersetu.dto.roadmap;

import com.careersetu.entity.Roadmap;
import lombok.Data;

@Data
public class RoadmapDto {
    private Long id;
    private String title;
    private String slug;
    private Long examId;
    private String examName;
    private Integer durationWeeks;
    private Roadmap.Difficulty difficulty;
    private Double successRate;
    private Object planJson;
}
