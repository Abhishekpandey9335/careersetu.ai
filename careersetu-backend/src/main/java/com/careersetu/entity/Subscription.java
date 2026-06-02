package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private Plan plan;

    private BigDecimal amount;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private String razorpayPaymentId;
    private String razorpayOrderId;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SubscriptionStatus status = SubscriptionStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum Plan {
        MONTHLY, YEARLY
    }

    public enum SubscriptionStatus {
        PENDING, ACTIVE, EXPIRED, CANCELLED, FAILED
    }
}
