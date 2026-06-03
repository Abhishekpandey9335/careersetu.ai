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
    SELECT j FROM Job j
    WHERE j.status = 'ACTIVE'
      AND (:type IS NULL OR j.type = :type)
      AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:salaryMin IS NULL OR j.salaryMin >= :salaryMin)
      AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')))
    """,
            countQuery = """
    SELECT COUNT(j) FROM Job j
    WHERE j.status = 'ACTIVE'
      AND (:type IS NULL OR j.type = :type)
      AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))
      AND (:salaryMin IS NULL OR j.salaryMin >= :salaryMin)
      AND (:search IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :search, '%')))
    """)
    Page<Job> searchJobs(
            @Param("type") Job.JobType type,
            @Param("location") String location,
            @Param("salaryMin") Integer salaryMin,
            @Param("search") String search,
            Pageable pageable
    );

    List<Job> findByCompanyIdAndStatus(Long companyId, Job.JobStatus status);

    List<Job> findTop6ByTypeAndStatusOrderByPostedAtDesc(Job.JobType type, Job.JobStatus status);

    long countByType(Job.JobType type);
}
