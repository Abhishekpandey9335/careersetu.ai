package com.careersetu.repository;

import com.careersetu.entity.ResumeUpload;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ResumeUploadRepository extends JpaRepository<ResumeUpload, Long> {
    Optional<ResumeUpload> findTopByUserIdOrderByUploadedAtDesc(Long userId);
}