package com.tncolleges.platform.controller;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import com.tncolleges.platform.security.JwtService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthController(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authManager) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        if (userRepo.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        // Self-service registration must never accept an elevated role or tenant ID
        // from the request body. Admin accounts are provisioned separately.
        User user = User.builder()
                .email(email)
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName().trim())
                .role(User.Role.STUDENT)
                .collegeId(null)
                .enabled(true)
                .build();
        userRepo.save(user);

        String token = jwtService.generateToken(user.getEmail(), Map.of(
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() != null ? user.getCollegeId().toString() : "",
                "userId", user.getId().toString()
        ));

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() != null ? user.getCollegeId() : "",
                "email", user.getEmail()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req) {
        String email = req.getEmail().trim().toLowerCase();
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(email, req.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userRepo.findByEmail(email).orElseThrow();
        String token = jwtService.generateToken(user.getEmail(), Map.of(
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() != null ? user.getCollegeId().toString() : "",
                "userId", user.getId().toString()
        ));

        return ResponseEntity.ok(Map.of(
                "token", token,
                "role", user.getRole().name(),
                "collegeId", user.getCollegeId() != null ? user.getCollegeId() : "",
                "email", user.getEmail(),
                "fullName", user.getFullName() != null ? user.getFullName() : ""
        ));
    }

    @Getter @Setter
    public static class RegisterRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 8, max = 100)
        private String password;

        @NotBlank
        @Size(max = 120)
        private String fullName;
    }

    @Getter @Setter
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }
}
