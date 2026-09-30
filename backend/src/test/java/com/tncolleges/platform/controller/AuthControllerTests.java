package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Base64;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTests {

    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;

    private AuthController authController;

    @BeforeEach
    void setUp() {
        // Use the real token service here: mocking its concrete class requires JDK instrumentation
        // that is restricted in some JDK 26 environments.
        JwtService jwtService = new JwtService();
        ReflectionTestUtils.setField(jwtService, "secretKey", Base64.getEncoder().encodeToString(new byte[32]));
        ReflectionTestUtils.setField(jwtService, "jwtExpiration", 3_600_000L);
        authController = new AuthController(userRepository, passwordEncoder, jwtService, authenticationManager);
    }

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

        ResponseEntity<?> response = authController.register(request);

        ArgumentCaptor<User> savedUser = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(savedUser.capture());
        assertEquals(User.Role.STUDENT, savedUser.getValue().getRole());
        assertNull(savedUser.getValue().getCollegeId());
        assertEquals("student@example.com", savedUser.getValue().getEmail());
        assertEquals("Student Name", savedUser.getValue().getFullName());
        assertEquals(200, response.getStatusCode().value());
        String token = (String) ((Map<?, ?>) response.getBody()).get("token");
        assertNotNull(token);
        assertTrue(token.split("\\.").length == 3);
    }
}
