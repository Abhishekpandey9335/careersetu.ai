package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private NotificationType type;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Builder.Default
    private boolean isRead = false;

    private Long relatedEntityId; // examId, jobId etc.
    private String relatedEntityType;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum NotificationType {
        EXAM_FORM_OPEN, ADMIT_CARD_OUT, RESULT_DECLARED,
        JOB_ALERT, DEADLINE_REMINDER, SYSTEM
    }
}
