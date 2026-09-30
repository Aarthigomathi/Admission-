package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);
    java.util.Optional<Notification> findByIdAndUserId(Long id, Long userId);
}
