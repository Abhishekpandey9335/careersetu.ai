package com.careersetu.scheduler;

import com.careersetu.entity.User;
import com.careersetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DeadlineReminderScheduler {

    private final UserRepository userRepository;

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
}
