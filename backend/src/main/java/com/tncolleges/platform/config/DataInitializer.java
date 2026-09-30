package com.tncolleges.platform.config;

import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

/** Development-only bootstrap accounts. College records are created only through college signup. */
@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initData(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            if (!userRepository.existsByEmail("superadmin@tncolleges.com")) {
                userRepository.save(User.builder()
                        .email("superadmin@tncolleges.com")
                        .password(encoder.encode("superadmin123"))
                        .fullName("Platform Admin")
                        .role(User.Role.PLATFORM_ADMIN)
                        .enabled(true)
                        .build());
            }
            if (!userRepository.existsByEmail("student@test.com")) {
                userRepository.save(User.builder()
                        .email("student@test.com")
                        .password(encoder.encode("student123"))
                        .fullName("Test Student")
                        .role(User.Role.STUDENT)
                        .enabled(true)
                        .build());
            }
            System.out.println("=== Development accounts initialized ===");
            System.out.println("Platform Admin: superadmin@tncolleges.com / superadmin123");
            System.out.println("Student: student@test.com / student123");
            System.out.println("Colleges are registered through POST /api/colleges/signup; no template colleges are seeded.");
        };
    }
}
