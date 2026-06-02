package com.careersetu.service;

import com.careersetu.entity.*;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Page<Notification> getForUser(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    @Transactional
    public void markRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", notificationId));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResourceNotFoundException("Notification", notificationId);
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    @Transactional
    public void createNotification(Long userId, Notification.NotificationType type,
                                    String title, String message,
                                    Long entityId, String entityType) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        Notification n = Notification.builder()
                .user(user).type(type).title(title).message(message)
                .relatedEntityId(entityId).relatedEntityType(entityType)
                .build();
        notificationRepository.save(n);
    }

    // Called by scheduler: notify all users subscribed to an exam when its status changes
    @Transactional
    public void broadcastExamNotification(List<Long> userIds, Notification.NotificationType type,
                                           String title, String message, Long examId) {
        List<Notification> notifications = userIds.stream().map(uid ->
                userRepository.findById(uid).map(user ->
                        Notification.builder().user(user).type(type)
                                .title(title).message(message)
                                .relatedEntityId(examId).relatedEntityType("EXAM")
                                .build()
                ).orElse(null)
        ).filter(n -> n != null).collect(Collectors.toList());
        notificationRepository.saveAll(notifications);
    }
}
