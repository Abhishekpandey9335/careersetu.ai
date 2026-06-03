package com.careersetu.repository;

import com.careersetu.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    @Query(value = """
        SELECT * FROM jobs j
        WHERE j.status = 'ACTIVE'
          AND (:type IS NULL OR j.type = CAST(:type AS VARCHAR))
          AND (:location IS NULL OR LOWER(j.location::text) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:salaryMin IS NULL OR j.salary_min >= CAST(:salaryMin AS INTEGER))
          AND (:search IS NULL OR LOWER(j.title::text) LIKE LOWER(CONCAT('%', :search, '%')))
        ORDER BY j.posted_at DESC
        """,
            countQuery = """
        SELECT COUNT(*) FROM jobs j
        WHERE j.status = 'ACTIVE'
          AND (:type IS NULL OR j.type = CAST(:type AS VARCHAR))
          AND (:location IS NULL OR LOWER(j.location::text) LIKE LOWER(CONCAT('%', :location, '%')))
          AND (:salaryMin IS NULL OR j.salary_min >= CAST(:salaryMin AS INTEGER))
          AND (:search IS NULL OR LOWER(j.title::text) LIKE LOWER(CONCAT('%', :search, '%')))
        """,
            nativeQuery = true)
    Page<Job> searchJobs(
            @Param("type") String type,
            @Param("location") String location,
            @Param("salaryMin") Integer salaryMin,
            @Param("search") String search,
            Pageable pageable
    );

    List<Job> findByCompanyIdAndStatus(Long companyId, Job.JobStatus status);

    List<Job> findTop6ByTypeAndStatusOrderByPostedAtDesc(Job.JobType type, Job.JobStatus status);

    long countByType(Job.JobType type);
}