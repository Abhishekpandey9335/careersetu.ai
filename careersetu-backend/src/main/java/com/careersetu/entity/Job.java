package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id")
    private Company company;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    private JobType type;

    private String location;
    private Integer salaryMin;
    private Integer salaryMax;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Object skillsRequired;

    private String qualification;
    private Integer experienceMin;
    private Integer experienceMax;

    private String applyLink;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private JobStatus status = JobStatus.ACTIVE;

    @CreationTimestamp
    private LocalDateTime postedAt;

    private LocalDate expiresAt;

    public enum JobType {
        PRIVATE, INTERNSHIP
    }

    public enum JobStatus {
        ACTIVE, CLOSED, FILLED
    }
}