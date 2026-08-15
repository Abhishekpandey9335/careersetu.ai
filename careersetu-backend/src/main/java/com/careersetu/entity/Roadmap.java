package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Table(name = "roadmaps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Roadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, unique = true)
    private String slug;

    private Integer durationWeeks;

    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    private Double successRate; // percentage

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object planJson; // week-by-week plan

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public enum Difficulty {
        BEGINNER, INTERMEDIATE, ADVANCED
    }
}
