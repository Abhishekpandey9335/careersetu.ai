package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "resume_uploads")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ResumeUpload {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String fileName;

    @Column(columnDefinition = "TEXT")
    private String extractedText;

    @CreationTimestamp
    private LocalDateTime uploadedAt;
}