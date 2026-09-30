package com.tncolleges.platform.security;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CollegeAccessServiceTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CollegeAccessService collegeAccessService;

    @Test
    void collegeAdminCanManageOnlyAssignedCollege() {
        when(userRepository.findByEmail("admin@example.com")).thenReturn(Optional.of(
                User.builder().email("admin@example.com").role(User.Role.COLLEGE_ADMIN).collegeId(12L).build()
        ));

        assertTrue(collegeAccessService.canManageCollege("admin@example.com", 12L));
        assertFalse(collegeAccessService.canManageCollege("admin@example.com", 13L));
    }

    @Test
    void platformAdminCanManageAnyCollege() {
        when(userRepository.findByEmail("platform@example.com")).thenReturn(Optional.of(
                User.builder().email("platform@example.com").role(User.Role.PLATFORM_ADMIN).build()
        ));

        assertTrue(collegeAccessService.canManageCollege("platform@example.com", 12L));
    }

    @Test
    void missingUserAndStudentCannotManageCollege() {
        when(userRepository.findByEmail("missing@example.com")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("student@example.com")).thenReturn(Optional.of(
                User.builder().email("student@example.com").role(User.Role.STUDENT).build()
        ));

        assertFalse(collegeAccessService.canManageCollege("missing@example.com", 12L));
        assertFalse(collegeAccessService.canManageCollege("student@example.com", 12L));
        assertFalse(collegeAccessService.canManageCollege(null, 12L));
    }
}
