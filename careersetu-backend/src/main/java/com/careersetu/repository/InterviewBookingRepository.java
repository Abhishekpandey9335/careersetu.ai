package com.careersetu.repository;

import com.careersetu.entity.InterviewBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewBookingRepository extends JpaRepository<InterviewBooking, Long> {
    List<InterviewBooking> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<InterviewBooking> findByStatus(InterviewBooking.BookingStatus status);
    List<InterviewBooking> findAllByOrderByCreatedAtDesc();
    long countByStatus(InterviewBooking.BookingStatus status);
}