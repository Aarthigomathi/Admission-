package com.tncolleges.platform.repository;

import com.tncolleges.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByUsernameIgnoreCase(String username);
    boolean existsByEmail(String email);
    boolean existsByUsernameIgnoreCase(String username);
    long countByRole(User.Role role);
    java.util.List<User> findAllByCollegeIdAndRoleIn(Long collegeId, java.util.Collection<User.Role> roles);
    java.util.List<User> findAllByRoleIn(java.util.Collection<User.Role> roles);

    default Optional<User> findByLoginIdentifier(String identifier) {
        if (identifier == null || identifier.isBlank()) return Optional.empty();
        for (String candidate : identifier.split("[/,]")) {
            String value = candidate.trim();
            if (value.isEmpty()) continue;
            Optional<User> user = findByUsernameIgnoreCase(value);
            if (user.isEmpty()) user = findByEmailIgnoreCase(value);
            if (user.isPresent()) return user;
        }
        return Optional.empty();
    }
}
