package com.careersetu.service;

import com.careersetu.dto.subscription.CreateOrderRequest;
import com.careersetu.dto.subscription.VerifyPaymentRequest;
import com.careersetu.entity.*;
import com.careersetu.exception.BadRequestException;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import com.careersetu.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    @Value("${razorpay.key-secret}")
    private String razorpayKeySecret;

    // Pricing
    private static final Map<Subscription.Plan, BigDecimal> PRICES = Map.of(
            Subscription.Plan.MONTHLY, new BigDecimal("99"),
            Subscription.Plan.YEARLY, new BigDecimal("799")
    );

    private static final Map<Subscription.Plan, Integer> DURATION_DAYS = Map.of(
            Subscription.Plan.MONTHLY, 30,
            Subscription.Plan.YEARLY, 365
    );

    /**
     * Creates a pending subscription record and returns the order details.
     * The actual Razorpay order creation would be done here if the SDK is integrated.
     */
    @Transactional
    public Map<String, Object> createOrder(Long userId, CreateOrderRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        BigDecimal amount = PRICES.get(req.getPlan());

        Subscription sub = Subscription.builder()
                .user(user).plan(req.getPlan()).amount(amount)
                .status(Subscription.SubscriptionStatus.PENDING)
                .build();
        sub = subscriptionRepository.save(sub);

        // In production: call Razorpay API to create order, store razorpayOrderId
        return Map.of(
                "subscriptionId", sub.getId(),
                "amount", amount.multiply(new BigDecimal("100")).intValue(), // paise
                "currency", "INR",
                "plan", req.getPlan(),
                "keyId", "rzp_key_configured_in_env"
        );
    }

    @Transactional
    public void verifyAndActivate(Long userId, VerifyPaymentRequest req) {
        // Verify Razorpay signature
        String payload = req.getRazorpayOrderId() + "|" + req.getRazorpayPaymentId();
        if (!verifyHmac(payload, req.getRazorpaySignature())) {
            throw new BadRequestException("Payment verification failed: invalid signature");
        }

        // Find pending subscription for this order
        Subscription sub = subscriptionRepository
                .findTopByUserIdAndStatusOrderByCreatedAtDesc(userId, Subscription.SubscriptionStatus.PENDING)
                .orElseThrow(() -> new ResourceNotFoundException("Pending subscription not found"));

        sub.setRazorpayOrderId(req.getRazorpayOrderId());
        sub.setRazorpayPaymentId(req.getRazorpayPaymentId());
        sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        sub.setStartDate(LocalDateTime.now());
        sub.setEndDate(LocalDateTime.now().plusDays(DURATION_DAYS.get(sub.getPlan())));
        subscriptionRepository.save(sub);

        // Update user premium flag
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        user.setPremium(true);
        user.setPremiumExpiry(sub.getEndDate());
        userRepository.save(user);
        try { emailService.sendPremiumActivated(user.getEmail(), user.getName(), sub.getPlan().name(), sub.getEndDate().toString()); } catch(Exception ignored) {}
    }

    public List<Subscription> getUserSubscriptions(Long userId) {
        return subscriptionRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    private boolean verifyHmac(String payload, String expectedSignature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec keySpec = new SecretKeySpec(
                    razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(keySpec);
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String computed = HexFormat.of().formatHex(hash);
            return computed.equals(expectedSignature);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            log.error("HMAC verification error", e);
            return false;
        }
    }
}
