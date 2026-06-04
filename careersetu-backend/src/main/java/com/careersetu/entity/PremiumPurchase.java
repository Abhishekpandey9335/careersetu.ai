package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "premium_purchases")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PremiumPurchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PdfType pdfType;

    private BigDecimal amount;

    private String upiTransactionId;

    private String screenshotUrl;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private PurchaseStatus status = PurchaseStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime approvedAt;

    public enum PdfType {
        HR_CONTACTS("Company Wise HR Contacts", new java.math.BigDecimal("19")),
        DSA_SHEET("DSA Sheet by Abhishek Pandey", new java.math.BigDecimal("15")),
        JAVA_INTERVIEW("Java Interview Questions", new java.math.BigDecimal("5")),
        SPRINGBOOT_INTERVIEW("Spring Boot Interview Questions", new java.math.BigDecimal("5")),
        SYSTEM_DESIGN("System Design Interview 20 Problems", new java.math.BigDecimal("5"));

        private final String displayName;
        private final java.math.BigDecimal price;

        PdfType(String displayName, java.math.BigDecimal price) {
            this.displayName = displayName;
            this.price = price;
        }

        public String getDisplayName() { return displayName; }
        public java.math.BigDecimal getPrice() { return price; }
    }

    public enum PurchaseStatus {
        PENDING,   // user ne payment submit ki, admin review baaki
        APPROVED,  // admin ne approve kiya, user access kar sakta hai
        REJECTED   // admin ne reject kiya
    }
}
