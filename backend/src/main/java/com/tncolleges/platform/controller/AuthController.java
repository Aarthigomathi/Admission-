package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.JwtService;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;
    private final StudentRepository studentRepository;

    @Autowired
    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService,
                          AuthenticationManager authManager, StudentRepository studentRepository) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
        this.studentRepository = studentRepository;
    }

    /** Preserves the lightweight unit-test constructor; production uses the autowired constructor. */
    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService,
                          AuthenticationManager authManager) {
        this(userRepo, passwordEncoder, jwtService, authManager, null);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepo.existsByEmailIgnoreCase(email)) return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .role(User.Role.STUDENT)
                .enabled(true)
                .build();
        userRepo.save(user);
        if (studentRepository != null) {
            studentRepository.save(Student.builder()
                    .user(user)
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .mobile(req.getMobile())
                    .district(req.getDistrict())
                    .city(req.getCity())
                    .updatedAt(java.time.LocalDateTime.now())
                    .build());
        }
        return ResponseEntity.ok(tokenResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String identifier = req.identifier();
        if (identifier == null || identifier.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email or login username is required"));
        }
        identifier = identifier.trim();
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(identifier, req.getPassword()));
        } catch (Exception exception) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        User user = userRepo.findByLoginIdentifier(identifier).orElseThrow();
        return ResponseEntity.ok(tokenResponse(user));
    }

    private Map<String, Object> tokenResponse(User user) {
        String token = jwtService.generateToken(user.getEmail(), Map.of(
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() == null ? "" : user.getCollegeId().toString(),
                "userId", user.getId().toString()));
        return Map.of(
                "token", token,
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() == null ? "" : user.getCollegeId(),
                "email", user.getEmail(),
                "username", user.getUsername() == null ? user.getEmail() : user.getUsername(),
                "fullName", user.getFullName() == null ? "" : user.getFullName(),
                "userId", user.getId());
    }

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank @Email private String email;
        @NotBlank @Size(min = 8, max = 100) private String password;
        @NotBlank @Size(max = 120) private String fullName;
        private String mobile;
        private String district;
        private String city;
    }

    @Getter @Setter
    public static class LoginRequest {
        private String email;
        private String loginId;
        private String username;
        @NotBlank private String password;

        public String identifier() {
            if (loginId != null && !loginId.isBlank()) return loginId;
            if (username != null && !username.isBlank()) return username;
            return email;
        }
    }
}
