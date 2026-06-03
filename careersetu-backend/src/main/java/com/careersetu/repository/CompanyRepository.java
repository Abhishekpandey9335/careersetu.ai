package com.careersetu.repository;

import com.careersetu.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    Optional<Company> findBySlug(String slug);

    @Query(value = """
    SELECT * FROM companies c
    WHERE (:industry IS NULL OR LOWER(CAST(c.industry AS TEXT)) LIKE LOWER(CONCAT('%', :industry, '%')))
      AND (:search IS NULL OR LOWER(CAST(c.name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))
    """,
            countQuery = """
    SELECT COUNT(*) FROM companies c
    WHERE (:industry IS NULL OR LOWER(CAST(c.industry AS TEXT)) LIKE LOWER(CONCAT('%', :industry, '%')))
      AND (:search IS NULL OR LOWER(CAST(c.name AS TEXT)) LIKE LOWER(CONCAT('%', :search, '%')))
    """,
            nativeQuery = true)
    Page<Company> searchCompanies(
            @Param("industry") String industry,
            @Param("search") String search,
            Pageable pageable
    );
}