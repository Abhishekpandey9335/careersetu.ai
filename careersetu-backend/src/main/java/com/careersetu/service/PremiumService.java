package com.careersetu.service;

import com.careersetu.entity.PremiumPurchase;
import com.careersetu.entity.User;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.PremiumPurchaseRepository;
import com.careersetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PremiumService {

    private final PremiumPurchaseRepository premiumPurchaseRepository;
    private final UserRepository userRepository;

    /**
     * User submits UPI payment proof for a specific PDF
     */
    @Transactional
    public Map<String, Object> submitPurchaseRequest(
            Long userId,
            String pdfTypeStr,
            String upiTransactionId,
            String screenshotUrl) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        PremiumPurchase.PdfType pdfType = PremiumPurchase.PdfType.valueOf(pdfTypeStr.toUpperCase());

        // Check if already approved
        Optional<PremiumPurchase> existingApproved = premiumPurchaseRepository
                .findByUserIdAndPdfTypeAndStatus(userId, pdfType, PremiumPurchase.PurchaseStatus.APPROVED);
        if (existingApproved.isPresent()) {
            throw new IllegalStateException("You already have access to this PDF!");
        }

        // Check if pending request already exists
        Optional<PremiumPurchase> existingPending = premiumPurchaseRepository
                .findByUserIdAndPdfTypeAndStatus(userId, pdfType, PremiumPurchase.PurchaseStatus.PENDING);
        if (existingPending.isPresent()) {
            throw new IllegalStateException("Your payment is already under review. Please wait for admin approval.");
        }

        PremiumPurchase purchase = PremiumPurchase.builder()
                .user(user)
                .pdfType(pdfType)
                .amount(pdfType.getPrice())
                .upiTransactionId(upiTransactionId)
                .screenshotUrl(screenshotUrl)
                .status(PremiumPurchase.PurchaseStatus.PENDING)
                .build();

        PremiumPurchase saved = premiumPurchaseRepository.save(purchase);

        Map<String, Object> response = new HashMap<>();
        response.put("id", saved.getId());
        response.put("pdfType", saved.getPdfType());
        response.put("amount", saved.getAmount());
        response.put("status", saved.getStatus());
        response.put("message", "Payment submitted! Admin will verify and grant access shortly.");
        return response;
    }

    /**
     * Check if user has approved access to a PDF
     */
    public boolean hasAccess(Long userId, String pdfTypeStr) {
        PremiumPurchase.PdfType pdfType = PremiumPurchase.PdfType.valueOf(pdfTypeStr.toUpperCase());
        return premiumPurchaseRepository
                .findByUserIdAndPdfTypeAndStatus(userId, pdfType, PremiumPurchase.PurchaseStatus.APPROVED)
                .isPresent();
    }

    /**
     * Get all PDF access status for a user (for frontend to show locked/unlocked state)
     */
    public Map<String, Object> getUserPdfAccess(Long userId) {
        List<PremiumPurchase> purchases = premiumPurchaseRepository.findByUserIdOrderByCreatedAtDesc(userId);

        Map<String, String> accessMap = new HashMap<>();
        for (PremiumPurchase.PdfType type : PremiumPurchase.PdfType.values()) {
            String status = "LOCKED"; // default
            for (PremiumPurchase p : purchases) {
                if (p.getPdfType() == type) {
                    if (p.getStatus() == PremiumPurchase.PurchaseStatus.APPROVED) {
                        status = "APPROVED";
                        break;
                    } else if (p.getStatus() == PremiumPurchase.PurchaseStatus.PENDING) {
                        status = "PENDING";
                    }
                }
            }
            accessMap.put(type.name(), status);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("access", accessMap);
        response.put("purchases", purchases);
        return response;
    }

    // ─── ADMIN METHODS ─────────────────────────────────────────────

    public List<PremiumPurchase> getAllPurchases(String statusFilter) {
        if (statusFilter == null || statusFilter.equalsIgnoreCase("ALL")) {
            return premiumPurchaseRepository.findAllByOrderByCreatedAtDesc();
        }
        return premiumPurchaseRepository.findByStatusOrderByCreatedAtDesc(
                PremiumPurchase.PurchaseStatus.valueOf(statusFilter.toUpperCase()));
    }

    @Transactional
    public Map<String, Object> approvePurchase(Long purchaseId) {
        PremiumPurchase purchase = premiumPurchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));

        purchase.setStatus(PremiumPurchase.PurchaseStatus.APPROVED);
        purchase.setApprovedAt(LocalDateTime.now());
        premiumPurchaseRepository.save(purchase);

        log.info("Admin approved PDF purchase #{} for user {} - PDF: {}",
                purchaseId, purchase.getUser().getEmail(), purchase.getPdfType());

        Map<String, Object> res = new HashMap<>();
        res.put("id", purchase.getId());
        res.put("status", "APPROVED");
        res.put("pdfType", purchase.getPdfType());
        res.put("userEmail", purchase.getUser().getEmail());
        res.put("message", "Access granted to " + purchase.getPdfType().getDisplayName());
        return res;
    }

    @Transactional
    public Map<String, Object> rejectPurchase(Long purchaseId) {
        PremiumPurchase purchase = premiumPurchaseRepository.findById(purchaseId)
                .orElseThrow(() -> new ResourceNotFoundException("Purchase not found"));

        purchase.setStatus(PremiumPurchase.PurchaseStatus.REJECTED);
        premiumPurchaseRepository.save(purchase);

        Map<String, Object> res = new HashMap<>();
        res.put("id", purchase.getId());
        res.put("status", "REJECTED");
        res.put("message", "Purchase rejected.");
        return res;
    }

    public Map<String, Object> getPdfStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPurchases", premiumPurchaseRepository.count());
        stats.put("pendingPurchases", premiumPurchaseRepository.countByStatus(PremiumPurchase.PurchaseStatus.PENDING));
        stats.put("approvedPurchases", premiumPurchaseRepository.countByStatus(PremiumPurchase.PurchaseStatus.APPROVED));
        stats.put("rejectedPurchases", premiumPurchaseRepository.countByStatus(PremiumPurchase.PurchaseStatus.REJECTED));
        return stats;
    }
}
