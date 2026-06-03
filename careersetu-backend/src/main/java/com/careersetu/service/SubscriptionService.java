package com.careersetu.service;

import com.careersetu.entity.*;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final Map<Subscription.Plan, BigDecimal> PRICES = Map.of(
            Subscription.Plan.MONTHLY, new BigDecimal("99"),
            Subscription.Plan.YEARLY, new BigDecimal("799")
    );

    private static final Map<Subscription.Plan, Integer> DURATION_DAYS = Map.of(
            Subscription.Plan.MONTHLY, 30,
            Subscription.Plan.YEARLY, 365
    );

    @Transactional
    public Map<String, Object> submitUpiRequest(Long userId, String planStr,
                                                String txnId, String screenshotUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        Subscription.Plan plan = Subscription.Plan.valueOf(planStr.toUpperCase());
        BigDecimal amount = PRICES.get(plan);

        Subscription sub = Subscription.builder()
                .user(user)
                .plan(plan)
                .amount(amount)
                .upiTransactionId(txnId)
                .screenshotUrl(screenshotUrl)
                .status(Subscription.SubscriptionStatus.PENDING)
                .build();
        sub = subscriptionRepository.save(sub);

        try {
            emailService.sendPremiumActivated(
                    user.getEmail(), user.getName(), plan.name(),
                    "Pending verification - will activate within 2-4 hours"
            );
        } catch (Exception ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("subscriptionId", sub.getId());
        result.put("plan", plan);
        result.put("amount", amount);
        result.put("status", "PENDING");
        result.put("message", "Payment request submitted. Premium will be activated within 2-4 hours after verification.");
        return result;
    }

    @Transactional
    public Map<String, Object> approveSubscription(Long subscriptionId) {
        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", subscriptionId));

        LocalDateTime now = LocalDateTime.now();
        int days = DURATION_DAYS.getOrDefault(sub.getPlan(), 30);

        sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        sub.setStartDate(now);
        sub.setEndDate(now.plusDays(days));
        subscriptionRepository.save(sub);

        try {
            emailService.sendPremiumActivated(
                    sub.getUser().getEmail(), sub.getUser().getName(),
                    sub.getPlan().name(),
                    "Valid until " + sub.getEndDate().toLocalDate()
            );
        } catch (Exception ignored) {}

        Map<String, Object> result = new HashMap<>();
        result.put("id", sub.getId());
        result.put("status", "ACTIVE");
        result.put("endDate", sub.getEndDate());
        result.put("message", "Subscription approved successfully");
        return result;
    }

    @Transactional
    public Map<String, Object> rejectSubscription(Long subscriptionId) {
        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", subscriptionId));

        sub.setStatus(Subscription.SubscriptionStatus.FAILED);
        subscriptionRepository.save(sub);

        Map<String, Object> result = new HashMap<>();
        result.put("id", sub.getId());
        result.put("status", "FAILED");
        result.put("message", "Subscription rejected");
        return result;
    }

    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Map<String, Object> getUserSubscriptionStatus(Long userId) {
        List<Subscription> subs = subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        Map<String, Object> result = new HashMap<>();
        boolean isActive = subs.stream().anyMatch(s ->
                s.getStatus() == Subscription.SubscriptionStatus.ACTIVE &&
                        s.getEndDate() != null && s.getEndDate().isAfter(LocalDateTime.now())
        );
        result.put("isPremium", isActive);
        result.put("subscriptions", subs);
        return result;
    }
}
