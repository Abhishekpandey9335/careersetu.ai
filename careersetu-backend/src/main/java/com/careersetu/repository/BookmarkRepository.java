package com.careersetu.repository;

import com.careersetu.entity.Bookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUserIdAndEntityType(Long userId, String entityType);
    List<Bookmark> findByUserId(Long userId);
    Optional<Bookmark> findByUserIdAndEntityTypeAndEntityId(Long userId, String entityType, Long entityId);
    boolean existsByUserIdAndEntityTypeAndEntityId(Long userId, String entityType, Long entityId);
    void deleteByUserIdAndEntityTypeAndEntityId(Long userId, String entityType, Long entityId);
}
