package com.careersetu.scheduler;

import com.careersetu.entity.Exam;
import com.careersetu.entity.Notification;
import com.careersetu.entity.Subscription;
import com.careersetu.entity.User;
import com.careersetu.repository.ExamRepository;
import com.careersetu.repository.NotificationRepository;
import com.careersetu.repository.SubscriptionRepository;
import com.careersetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadlineReminderScheduler {

    private final ExamRepository examRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    private final SubscriptionRepository subscriptionRepository;

    /**
     * Runs every day at 8:00 AM.
     * Finds exams whose form closing date is exactly 3 days away
     * and notifies ALL registered users (simple broadcast).
     *
     * For production, this should be scoped to users who have bookmarked / are eligible for the exam.
     */
    @Scheduled(cron = "0 0 8 * * *")
    @Transactional
    public void sendDeadlineReminders() {
        LocalDate threeDaysFromNow = LocalDate.now().plusDays(3);
        log.info("Running deadline reminder scheduler for date: {}", threeDaysFromNow);

        // Find all exams whose form closes in exactly 3 days
        List<Exam> expiringExams = examRepository.findAll().stream()
                .filter(e -> e.getFormEnd() != null && e.getFormEnd().equals(threeDaysFromNow))
                .toList();

        if (expiringExams.isEmpty()) {
            log.info("No exams closing in 3 days. Skipping.");
            return;
        }

        // Get all user IDs (paginated to avoid OOM in large user base)
        List<Long> userIds = userRepository.findAll(PageRequest.of(0, 10000))
                .stream().map(User::getId).toList();

        List<Notification> notifications = new ArrayList<>();
        for (Exam exam : expiringExams) {
            String title   = "⏰ Last 3 Days: " + exam.getName() + " Form Deadline";
            String message = String.format(
                    "The application form for %s closes on %s. Don't miss it! Apply now: %s",
                    exam.getName(), exam.getFormEnd(), exam.getOfficialApplyUrl());

            for (Long uid : userIds) {
                userRepository.findById(uid).ifPresent(user ->
                        notifications.add(Notification.builder()
                                .user(user)
                                .type(Notification.NotificationType.DEADLINE_REMINDER)
                                .title(title)
                                .message(message)
                                .relatedEntityId(exam.getId())
                                .relatedEntityType("EXAM")
                                .build()));
            }
        }

        notificationRepository.saveAll(notifications);
        log.info("Sent {} deadline reminder notifications for {} exams",
                notifications.size(), expiringExams.size());
    }

    /**
     * Runs every day at midnight.
     * Expires premium subscriptions that have passed their end date.
     */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void expirePremiumSubscriptions() {
        log.info("Checking for expired premium subscriptions...");

        List<User> premiumUsers = userRepository.findAll().stream()
                .filter(u -> u.isPremium()
                        && u.getPremiumExpiry() != null
                        && u.getPremiumExpiry().isBefore(java.time.LocalDateTime.now()))
                .toList();

        for (User user : premiumUsers) {
            user.setPremium(false);
            user.setPremiumExpiry(null);
        }
        userRepository.saveAll(premiumUsers);

        if (!premiumUsers.isEmpty()) {
            log.info("Expired premium for {} users", premiumUsers.size());
        }
    }

    /**
     * Runs every day at 9:00 AM.
     * Notifies users when a new exam form opens (status changed to FORM_OPEN in last 24 hours).
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void notifyNewFormOpenings() {
        LocalDate today = LocalDate.now();
        List<Exam> newlyOpen = examRepository.findAll().stream()
                .filter(e -> e.getStatus() == Exam.ExamStatus.FORM_OPEN
                        && e.getFormStart() != null
                        && e.getFormStart().equals(today))
                .toList();

        if (newlyOpen.isEmpty()) return;

        List<Long> userIds = userRepository.findAll(PageRequest.of(0, 10000))
                .stream().map(User::getId).toList();

        List<Notification> notifications = new ArrayList<>();
        for (Exam exam : newlyOpen) {
            String title   = "📋 New Form Open: " + exam.getName();
            String message = String.format(
                    "%s application form is now open! Last date: %s. Vacancies: %s. Apply: %s",
                    exam.getName(), exam.getFormEnd(), exam.getVacancy(), exam.getOfficialApplyUrl());

            for (Long uid : userIds) {
                userRepository.findById(uid).ifPresent(user ->
                        notifications.add(Notification.builder()
                                .user(user)
                                .type(Notification.NotificationType.EXAM_FORM_OPEN)
                                .title(title)
                                .message(message)
                                .relatedEntityId(exam.getId())
                                .relatedEntityType("EXAM")
                                .build()));
            }
        }
        notificationRepository.saveAll(notifications);
        log.info("Sent {} new form opening notifications", notifications.size());
    }
}
