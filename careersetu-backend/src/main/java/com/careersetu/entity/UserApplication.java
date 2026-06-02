package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_applications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Either jobId or examId will be set
    private Long jobId;
    private Long examId;

    @Enumerated(EnumType.STRING)
    private ApplicationEntityType entityType;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @CreationTimestamp
    private LocalDateTime appliedAt;

    private LocalDateTime updatedAt;

    public enum ApplicationEntityType {
        JOB, EXAM
    }

    public enum ApplicationStatus {
        APPLIED, UNDER_REVIEW, SHORTLISTED, SELECTED, REJECTED, WITHDRAWN
    }
}
