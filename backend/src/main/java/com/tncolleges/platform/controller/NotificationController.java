package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.Notification;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.NotificationRepository;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@PreAuthorize("isAuthenticated()")
public class NotificationController {
    private final NotificationRepository notifications;
    private final UserRepository users;

    public NotificationController(NotificationRepository notifications, UserRepository users) {
        this.notifications = notifications;
        this.users = users;
    }

    @GetMapping
    public ResponseEntity<?> list(@AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        List<Map<String, Object>> items = notifications.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::toMap).toList();
        long unread = items.stream().filter(item -> Boolean.FALSE.equals(item.get("read"))).count();
        return ResponseEntity.ok(Map.of("notifications", items, "unreadCount", unread));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id, @AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        Notification notification = notifications.findByIdAndUserId(id, user.getId())
                .orElseThrow(() -> new java.util.NoSuchElementException("Notification not found"));
        notification.setRead(true);
        return ResponseEntity.ok(toMap(notifications.save(notification)));
    }

    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(@AuthenticationPrincipal UserDetails principal) {
        User user = currentUser(principal);
        List<Notification> items = notifications.findByUserIdOrderByCreatedAtDesc(user.getId());
        items.forEach(item -> item.setRead(true));
        notifications.saveAll(items);
        return ResponseEntity.ok(Map.of("updated", items.size()));
    }

    private User currentUser(UserDetails principal) {
        if (principal == null) throw new org.springframework.security.authentication.AuthenticationCredentialsNotFoundException("Authentication required");
        return users.findByEmail(principal.getUsername()).orElseThrow(() -> new java.util.NoSuchElementException("User not found"));
    }

    private Map<String, Object> toMap(Notification notification) {
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", notification.getId());
        result.put("title", notification.getTitle());
        result.put("message", notification.getMessage());
        result.put("type", notification.getType());
        result.put("read", notification.isRead());
        result.put("collegeId", notification.getCollegeId());
        result.put("createdAt", notification.getCreatedAt());
        return result;
    }
}
