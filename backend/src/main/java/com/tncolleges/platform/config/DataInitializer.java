package com.tncolleges.platform.config;

import com.tncolleges.platform.model.Student;
import com.tncolleges.platform.model.User;
import com.tncolleges.platform.repository.StudentRepository;
import com.tncolleges.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Locale;

/** Optional bootstrap accounts; credentials must be supplied through deployment configuration. */
@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner initData(UserRepository userRepository, StudentRepository studentRepository,
                               PasswordEncoder encoder,
                               @org.springframework.beans.factory.annotation.Value("${app.bootstrap.platform-admin.email:}") String adminEmailValue,
                               @org.springframework.beans.factory.annotation.Value("${app.bootstrap.platform-admin.password:}") String adminPassword,
                               @org.springframework.beans.factory.annotation.Value("${app.bootstrap.demo-student.email:}") String studentEmailValue,
                               @org.springframework.beans.factory.annotation.Value("${app.bootstrap.demo-student.password:}") String studentPassword) {
        return args -> {
            String adminEmail = normalizeEmail(adminEmailValue);
            if ((adminEmail == null) != (adminPassword == null || adminPassword.isBlank())) {
                throw new IllegalStateException("Configure both APP_BOOTSTRAP_ADMIN_EMAIL and APP_BOOTSTRAP_ADMIN_PASSWORD, or neither");
            }
            if (adminEmail != null && adminPassword != null && !adminPassword.isBlank()) {
                if (adminPassword.length() < 12) throw new IllegalStateException("Bootstrap platform-admin password must be at least 12 characters");
                User existingAdmin = userRepository.findByEmailIgnoreCase(adminEmail).orElse(null);
                if (existingAdmin == null) {
                    userRepository.save(User.builder()
                            .email(adminEmail)
                            .username(adminEmail)
                            .password(encoder.encode(adminPassword))
                            .fullName("Platform Admin")
                            .role(User.Role.PLATFORM_ADMIN)
                            .enabled(true)
                            .build());
                } else if (existingAdmin.getRole() != User.Role.PLATFORM_ADMIN && existingAdmin.getRole() != User.Role.SUPER_ADMIN) {
                    throw new IllegalStateException("Bootstrap platform-admin email belongs to a non-platform account");
                }
            }

            String studentEmail = normalizeEmail(studentEmailValue);
            if ((studentEmail == null) != (studentPassword == null || studentPassword.isBlank())) {
                throw new IllegalStateException("Configure both APP_BOOTSTRAP_STUDENT_EMAIL and APP_BOOTSTRAP_STUDENT_PASSWORD, or neither");
            }
            if (studentEmail != null && studentPassword != null && !studentPassword.isBlank()) {
                if (studentPassword.length() < 8) throw new IllegalStateException("Bootstrap demo-student password must be at least 8 characters");
                User demoStudent = userRepository.findByEmailIgnoreCase(studentEmail).orElseGet(() -> userRepository.save(User.builder()
                        .email(studentEmail)
                        .username(studentEmail)
                        .password(encoder.encode(studentPassword))
                        .fullName("Test Student")
                        .role(User.Role.STUDENT)
                        .enabled(true)
                        .build()));
                if (demoStudent.getRole() != User.Role.STUDENT) throw new IllegalStateException("Bootstrap demo-student email belongs to a non-student account");
                if (studentRepository.findByUser_Id(demoStudent.getId()).isEmpty()) {
                    studentRepository.save(Student.builder()
                            .user(demoStudent)
                            .fullName(demoStudent.getFullName())
                            .email(demoStudent.getEmail())
                            .build());
                }
            }
            System.out.println("Optional bootstrap accounts initialized from configured credentials.");
            System.out.println("College accounts are created through POST /api/colleges/signup; no template colleges are seeded.");
        };
    }

    private String normalizeEmail(String value) {
        if (value == null || value.isBlank()) return null;
        String email = value.trim().toLowerCase(Locale.ROOT);
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new IllegalStateException("Bootstrap account email must be valid");
        return email;
    }
}
