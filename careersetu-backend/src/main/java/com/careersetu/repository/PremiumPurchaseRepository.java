package com.careersetu.repository;

import com.careersetu.entity.PremiumPurchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PremiumPurchaseRepository extends JpaRepository<PremiumPurchase, Long> {

    // Check if user has approved access to a specific PDF
    Optional<PremiumPurchase> findByUserIdAndPdfTypeAndStatus(
            Long userId,
            PremiumPurchase.PdfType pdfType,
            PremiumPurchase.PurchaseStatus status
    );

    // Get all purchases for a user
    List<PremiumPurchase> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Admin: get all purchases filtered by status
    List<PremiumPurchase> findByStatusOrderByCreatedAtDesc(PremiumPurchase.PurchaseStatus status);

    // Admin: get all purchases
    List<PremiumPurchase> findAllByOrderByCreatedAtDesc();

    // Count pending for stats
    long countByStatus(PremiumPurchase.PurchaseStatus status);
}
