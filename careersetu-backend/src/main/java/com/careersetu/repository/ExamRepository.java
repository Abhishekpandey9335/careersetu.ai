package com.careersetu.repository;

import com.careersetu.entity.Exam;
import com.careersetu.entity.UserProfile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {

    Optional<Exam> findBySlug(String slug);

    Page<Exam> findByCategory(Exam.ExamCategory category, Pageable pageable);

    @Query(value = "SELECT * FROM exams e WHERE e.status = 'FORM_OPEN' ORDER BY e.form_end ASC LIMIT 20",
            nativeQuery = true)
    List<Exam> findActiveFormOpenExams(Pageable pageable);

    @Query(value = """
        SELECT * FROM exams e
        WHERE (:category IS NULL OR e.category = CAST(:category AS VARCHAR))
          AND (:status IS NULL OR e.status = CAST(:status AS VARCHAR))
          AND (:search IS NULL OR LOWER(CAST(e.name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY e.form_end ASC NULLS LAST
        """,
            countQuery = """
        SELECT COUNT(*) FROM exams e
        WHERE (:category IS NULL OR e.category = CAST(:category AS VARCHAR))
          AND (:status IS NULL OR e.status = CAST(:status AS VARCHAR))
          AND (:search IS NULL OR LOWER(CAST(e.name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))
        """,
            nativeQuery = true)
    Page<Exam> searchExams(
            @Param("category") String category,
            @Param("status") String status,
            @Param("search") String search,
            Pageable pageable
    );

    @Query("""
        SELECT e FROM Exam e
        WHERE (:minAge IS NULL OR e.minAge <= :age)
          AND (:maxAge IS NULL OR e.maxAge >= :age)
          AND (e.minQualification <= :qualification)
        """)
    List<Exam> findEligibleExams(
            @Param("age") int age,
            @Param("minAge") Integer minAge,
            @Param("maxAge") Integer maxAge,
            @Param("qualification") UserProfile.Qualification qualification
    );

    List<Exam> findTop5ByOrderByCreatedAtDesc();
}