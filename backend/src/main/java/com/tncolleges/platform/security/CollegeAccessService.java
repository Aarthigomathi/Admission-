package com.tncolleges.platform.security;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Objects;
import java.util.Optional;

/**
 * Resolves tenant access from the authenticated database user, never from client-supplied headers.
 */
@Service
public class CollegeAccessService {

    private final UserRepository userRepository;

    public CollegeAccessService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public boolean canManageCollege(String username, Long requestedCollegeId) {
        if (username == null || requestedCollegeId == null) {
            return false;
        }

        return userRepository.findByLoginIdentifier(username)
                .map(user -> switch (user.getRole()) {
                    case PLATFORM_ADMIN, SUPER_ADMIN -> true;
                    case COLLEGE_ADMIN, COLLEGE_EDITOR -> Objects.equals(user.getCollegeId(), requestedCollegeId);
                    default -> false;
                })
                .orElse(false);
    }

    public Optional<Long> findManagedCollegeId(String username) {
        if (username == null) {
            return Optional.empty();
        }
        return userRepository.findByLoginIdentifier(username)
                .filter(user -> user.getRole() == User.Role.COLLEGE_ADMIN || user.getRole() == User.Role.COLLEGE_EDITOR)
                .map(User::getCollegeId);
    }
}
