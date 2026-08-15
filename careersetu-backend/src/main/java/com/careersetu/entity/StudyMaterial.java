package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class StudyMaterial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String subject;

    @Enumerated(EnumType.STRING)
    private MaterialType type;

    private String fileUrl;
    private boolean isPremium;

    @Builder.Default
    private Integer downloadsCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public enum MaterialType {
        SYLLABUS, NOTES, PYQ, MOCK_TEST, VIDEO, EBOOK, CURRENT_AFFAIRS
    }
}
