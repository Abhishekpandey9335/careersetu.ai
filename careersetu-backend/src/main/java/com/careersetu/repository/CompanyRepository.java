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

    @Query("""
        SELECT c FROM Company c
        WHERE (:industry IS NULL OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :industry, '%')))
          AND (:search IS NULL OR LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%')))
        """)
    Page<Company> searchCompanies(
            @Param("industry") String industry,
            @Param("search") String search,
            Pageable pageable
    );
}
