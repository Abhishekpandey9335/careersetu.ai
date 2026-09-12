package com.careersetu.service;

import com.careersetu.entity.InterviewBooking;
import com.careersetu.entity.User;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.InterviewBookingRepository;
import com.careersetu.repository.UserRepository;
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
public class InterviewBookingService {

    private final InterviewBookingRepository interviewBookingRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    private static final Map<InterviewBooking.InterviewType, BigDecimal> PRICES = Map.ofEntries(
            Map.entry(InterviewBooking.InterviewType.FRONTEND_DEVELOPER, new BigDecimal("49")),
            Map.entry(InterviewBooking.InterviewType.BACKEND_DEVELOPER, new BigDecimal("69")),
            Map.entry(InterviewBooking.InterviewType.FULL_STACK_DEVELOPER, new BigDecimal("99")),
            Map.entry(InterviewBooking.InterviewType.AI_ML_INTERVIEW, new BigDecimal("99")),
            Map.entry(InterviewBooking.InterviewType.ML_ENGINEER, new BigDecimal("99")),
            Map.entry(InterviewBooking.InterviewType.GEN_AI_DEVELOPER, new BigDecimal("99")),
            Map.entry(InterviewBooking.InterviewType.SYSTEM_DESIGN_ENGINEER, new BigDecimal("99")),
            Map.entry(InterviewBooking.InterviewType.FULL_STACK_AI_ML_INTERVIEW, new BigDecimal("129"))
    );

    @Transactional
    public Map<String, Object> submitBooking(Long userId, String interviewTypeStr,
                                             String txnId, String screenshotUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        InterviewBooking.InterviewType type = InterviewBooking.InterviewType.valueOf(interviewTypeStr.toUpperCase());
        BigDecimal fee = PRICES.get(type);

        InterviewBooking booking = InterviewBooking.builder()
                .user(user)
                .interviewType(type)
                .fee(fee)
                .upiTransactionId(txnId)
                .screenshotUrl(screenshotUrl)
                .status(InterviewBooking.BookingStatus.PENDING)
                .build();
        booking = interviewBookingRepository.save(booking);

        Map<String, Object> result = new HashMap<>();
        result.put("bookingId", booking.getId());
        result.put("interviewType", type);
        result.put("fee", fee);
        result.put("status", "PENDING");
        result.put("message", "Booking request submitted. We'll schedule your mock interview within 1 week after payment verification.");
        return result;
    }

    @Transactional
    public Map<String, Object> confirmBooking(Long bookingId, String meetLink, LocalDateTime scheduledAt) {
        InterviewBooking booking = interviewBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewBooking", bookingId));

        booking.setStatus(InterviewBooking.BookingStatus.CONFIRMED);
        booking.setMeetLink(meetLink);
        booking.setScheduledAt(scheduledAt);
        interviewBookingRepository.save(booking);

        try {
            emailService.sendInterviewConfirmation(
                    booking.getUser().getEmail(),
                    booking.getUser().getName(),
                    booking.getInterviewType().name(),
                    meetLink,
                    scheduledAt
            );
        } catch (Exception e) {
            log.warn("Failed to send interview confirmation email for booking {}", bookingId, e);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("id", booking.getId());
        result.put("status", "CONFIRMED");
        result.put("meetLink", meetLink);
        result.put("scheduledAt", scheduledAt);
        result.put("message", "Interview confirmed and scheduled");
        return result;
    }

    @Transactional
    public Map<String, Object> rejectBooking(Long bookingId) {
        InterviewBooking booking = interviewBookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("InterviewBooking", bookingId));

        booking.setStatus(InterviewBooking.BookingStatus.REJECTED);
        interviewBookingRepository.save(booking);

        Map<String, Object> result = new HashMap<>();
        result.put("id", booking.getId());
        result.put("status", "REJECTED");
        result.put("message", "Booking rejected");
        return result;
    }

    public List<InterviewBooking> getUserBookings(Long userId) {
        return interviewBookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}