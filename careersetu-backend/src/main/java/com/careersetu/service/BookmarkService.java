package com.careersetu.service;

import com.careersetu.entity.Bookmark;
import com.careersetu.entity.User;
import com.careersetu.exception.ResourceNotFoundException;
import com.careersetu.repository.BookmarkRepository;
import com.careersetu.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;

    @Transactional
    public Map<String, Object> toggle(Long userId, String entityType, Long entityId) {
        boolean exists = bookmarkRepository.existsByUserIdAndEntityTypeAndEntityId(userId, entityType, entityId);
        if (exists) {
            bookmarkRepository.deleteByUserIdAndEntityTypeAndEntityId(userId, entityType, entityId);
            return Map.of("bookmarked", false, "message", "Bookmark removed");
        } else {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User", userId));
            bookmarkRepository.save(Bookmark.builder()
                    .user(user).entityType(entityType).entityId(entityId).build());
            return Map.of("bookmarked", true, "message", "Bookmarked successfully");
        }
    }

    public boolean isBookmarked(Long userId, String entityType, Long entityId) {
        return bookmarkRepository.existsByUserIdAndEntityTypeAndEntityId(userId, entityType, entityId);
    }

    public List<Bookmark> getUserBookmarks(Long userId, String entityType) {
        if (entityType != null) {
            return bookmarkRepository.findByUserIdAndEntityType(userId, entityType);
        }
        return bookmarkRepository.findByUserId(userId);
    }
}
