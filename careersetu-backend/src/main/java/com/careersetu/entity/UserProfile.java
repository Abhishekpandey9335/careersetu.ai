package com.careersetu.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "user_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    private Integer age;

    @Enumerated(EnumType.STRING)
    private Qualification qualification;

    private String stream;   // Science, Commerce, Arts, Engineering, etc.
    private String state;
    private String category; // General, OBC, SC, ST, EWS

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> skills;

    private String goal;         // e.g. "Govt Job", "Private IT", "MBA"
    private Integer expectedSalary; // in thousands per month

    @Enumerated(EnumType.STRING)
    private PreferredMode preferredMode;

    private String aboutMe;
    private String linkedinUrl;
    private String resumeUrl;

    public enum Qualification {
        CLASS_10, CLASS_12, DIPLOMA, GRADUATE, POSTGRADUATE, PHD
    }

    public enum PreferredMode {
        GOVT_JOB, PRIVATE_JOB, BOTH, ENTREPRENEURSHIP
    }
}
