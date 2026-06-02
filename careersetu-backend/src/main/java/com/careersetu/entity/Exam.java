package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.type.SqlTypes;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exams")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String slug;

    @Enumerated(EnumType.STRING)
    private ExamCategory category;

    private String conductingBody;

    private Integer minAge;
    private Integer maxAge;

    @Enumerated(EnumType.STRING)
    private UserProfile.Qualification minQualification;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> allowedStreams;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private String categoryRelaxations;

    private Integer vacancy;
    private LocalDate formStart;
    private LocalDate formEnd;
    private LocalDate examDate;
    private LocalDate resultDate;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ExamStatus status = ExamStatus.UPCOMING;

    private String officialNotificationUrl;
    private String officialApplyUrl;
    private String logoUrl;

    private Integer salaryMin;
    private Integer salaryMax;

    private String applicationFeeGeneral;
    private String applicationFeeReserved;

    @OneToOne(mappedBy = "exam", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private ExamDetail detail;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum ExamCategory {
        SSC, UPSC, BANKING, RAILWAY, STATE_PSC, DEFENCE, TEACHING, POLICE, INSURANCE, OTHER
    }

    public enum ExamStatus {
        UPCOMING, FORM_OPEN, FORM_CLOSED, ADMIT_CARD_OUT, EXAM_SCHEDULED, RESULT_OUT
    }
}