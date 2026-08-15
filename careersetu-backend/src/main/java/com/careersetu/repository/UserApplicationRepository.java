package com.careersetu.repository;

import com.careersetu.entity.UserApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserApplicationRepository extends JpaRepository<UserApplication, Long> {
    List<UserApplication> findByUserIdOrderByAppliedAtDesc(Long userId);
    boolean existsByUserIdAndJobId(Long userId, Long jobId);
}
