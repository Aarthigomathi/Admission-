package com.tncolleges.platform.config;

import com.tncolleges.platform.model.*;
import com.tncolleges.platform.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(
            CollegeRepository collegeRepo,
            UserRepository userRepo,
            CourseRepository courseRepo,
            PasswordEncoder encoder) {
        return args -> {
            if (collegeRepo.count() > 0) return;

            // Create colleges matching frontend mock
            College psg = College.builder()
                    .slug("psg-tech")
                    .name("PSG College of Technology")
                    .shortName("PSG Tech")
                    .tagline("Empowering Innovation Since 1951")
                    .type("Autonomous Engineering College")
                    .district("Coimbatore")
                    .affiliation("Anna University")
                    .accreditation("NAAC A++ • NBA • NIRF 67")
                    .established(1951)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build();
            collegeRepo.save(psg);

            College cit = College.builder()
                    .slug("cit-coimbatore")
                    .name("Coimbatore Institute of Technology")
                    .shortName("CIT")
                    .tagline("Knowledge is Power")
                    .type("Government Aided Autonomous")
                    .district("Coimbatore")
                    .affiliation("Anna University")
                    .accreditation("NAAC A+ • NBA • NIRF 102")
                    .established(1956)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build();
            collegeRepo.save(cit);

            College kct = College.builder()
                    .slug("kumaraguru-college")
                    .name("Kumaraguru College of Technology")
                    .shortName("KCT")
                    .tagline("Character is Life")
                    .type("Autonomous Private")
                    .district("Coimbatore")
                    .affiliation("Anna University")
                    .accreditation("NAAC A++ • NBA • NIRF 89")
                    .established(1984)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build();
            collegeRepo.save(kct);

            // Courses for PSG
            courseRepo.save(Course.builder().college(psg).name("B.E. Computer Science and Engineering").degreeType("B.E").level("UG").duration("4 Years").fees("₹2,20,000/year").intake(180).active(true).build());
            courseRepo.save(Course.builder().college(psg).name("B.Tech Artificial Intelligence & Data Science").degreeType("B.Tech").level("UG").duration("4 Years").fees("₹2,50,000/year").intake(120).active(true).build());
            courseRepo.save(Course.builder().college(psg).name("BCA").degreeType("BCA").level("UG").duration("3 Years").fees("₹65,000/year").intake(120).active(true).build());

            // Users - multi-tenant isolation demo
            userRepo.save(User.builder().email("superadmin@tncolleges.com").password(encoder.encode("superadmin123")).fullName("Super Admin").role(User.Role.SUPER_ADMIN).enabled(true).build());
            userRepo.save(User.builder().email("admin@psgtech.ac.in").password(encoder.encode("psg123")).fullName("PSG Tech Admin").role(User.Role.COLLEGE_ADMIN).collegeId(psg.getId()).enabled(true).build());
            userRepo.save(User.builder().email("admin@cit.edu.in").password(encoder.encode("cit123")).fullName("CIT Admin").role(User.Role.COLLEGE_ADMIN).collegeId(cit.getId()).enabled(true).build());
            userRepo.save(User.builder().email("admin@kct.ac.in").password(encoder.encode("kct123")).fullName("KCT Admin").role(User.Role.COLLEGE_ADMIN).collegeId(kct.getId()).enabled(true).build());
            userRepo.save(User.builder().email("student@test.com").password(encoder.encode("student123")).fullName("Test Student").role(User.Role.STUDENT).enabled(true).build());

            System.out.println("=== Seed Data Initialized ===");
            System.out.println("Super Admin: superadmin@tncolleges.com / superadmin123");
            System.out.println("PSG Admin (college_id " + psg.getId() + "): admin@psgtech.ac.in / psg123");
            System.out.println("CIT Admin (college_id " + cit.getId() + "): admin@cit.edu.in / cit123");
            System.out.println("KCT Admin (college_id " + kct.getId() + "): admin@kct.ac.in / kct123");
        };
    }
}
