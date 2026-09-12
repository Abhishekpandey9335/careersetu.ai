package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_bookings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InterviewBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private InterviewType interviewType;

    private BigDecimal fee;

    private String upiTransactionId;

    @Column(columnDefinition = "TEXT")
    private String screenshotUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BookingStatus status = BookingStatus.PENDING;

    private String meetLink;
    private LocalDateTime scheduledAt;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum InterviewType {
        FRONTEND_DEVELOPER,
        BACKEND_DEVELOPER,
        FULL_STACK_DEVELOPER,
        AI_ML_INTERVIEW,
        ML_ENGINEER,
        GEN_AI_DEVELOPER,
        SYSTEM_DESIGN_ENGINEER,
        FULL_STACK_AI_ML_INTERVIEW
    }

    public enum BookingStatus {
        PENDING, CONFIRMED, COMPLETED, REJECTED
    }
}