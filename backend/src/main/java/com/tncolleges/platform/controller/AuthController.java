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
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already exists"));
        }
        User user = User.builder()
                .email(req.getEmail())
                .password(passwordEncoder.encode(req.getPassword()))
                .fullName(req.getFullName())
                .role(req.getRole() != null ? req.getRole() : User.Role.PUBLIC_USER)
                .collegeId(req.getCollegeId())
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
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        try {
            authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }

        User user = userRepo.findByEmail(req.getEmail()).orElseThrow();
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
        private String email;
        private String password;
        private String fullName;
        private User.Role role;
        private Long collegeId;
    }

    @Getter @Setter
    public static class LoginRequest {
        private String email;
        private String password;
    }
}
