package com.careersetu.repository;

import com.careersetu.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findTopByUserIdAndStatusOrderByCreatedAtDesc(Long userId, Subscription.SubscriptionStatus status);
    List<Subscription> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Subscription> findByStatus(Subscription.SubscriptionStatus status);
    List<Subscription> findAllByOrderByCreatedAtDesc();
    long countByStatus(Subscription.SubscriptionStatus status);
}
