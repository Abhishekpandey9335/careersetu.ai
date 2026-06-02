package com.careersetu.repository;

import com.careersetu.entity.StudyMaterial;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {

    @Query("""
        SELECT s FROM StudyMaterial s
        WHERE (:examId IS NULL OR s.exam.id = :examId)
          AND (:type IS NULL OR s.type = :type)
          AND (:premium IS NULL OR s.isPremium = :premium)
        ORDER BY s.downloadsCount DESC
        """)
    Page<StudyMaterial> filterMaterials(
            @Param("examId") Long examId,
            @Param("type") StudyMaterial.MaterialType type,
            @Param("premium") Boolean premium,
            Pageable pageable
    );
}
