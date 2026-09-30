package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTests {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private JwtService jwtService;
    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthController authController;

    @Test
    void publicRegistrationAlwaysCreatesStudentWithoutCollegeAssignment() {
        AuthController.RegisterRequest request = new AuthController.RegisterRequest();
        request.setEmail("  Student@Example.com ");
        request.setPassword("secure-pass-123");
        request.setFullName(" Student Name ");

        when(userRepository.existsByEmail("student@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secure-pass-123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setId(7L);
            return user;
        });
        when(jwtService.generateToken(any(), anyMap())).thenReturn("test-token");

        ResponseEntity<?> response = authController.register(request);

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());
        assertEquals(User.Role.STUDENT, savedUser.getValue().getRole());
        assertNull(savedUser.getValue().getCollegeId());
        assertEquals("student@example.com", savedUser.getValue().getEmail());
        assertEquals("Student Name", savedUser.getValue().getFullName());
        assertEquals(200, response.getStatusCode().value());
        assertEquals("test-token", ((Map<?, ?>) response.getBody()).get("token"));
    }
}
