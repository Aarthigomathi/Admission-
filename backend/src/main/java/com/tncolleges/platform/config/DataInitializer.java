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
    CommandLineRunner initData(CollegeRepository collegeRepo, UserRepository userRepo,
                               CourseRepository courseRepo, StudentRepository studentRepo,
                               StudentEducationRepository educationRepo,
                               StudentPreferencesRepository preferencesRepo,
                               PasswordEncoder encoder) {
        return args -> {
            if (collegeRepo.count() > 0) return;

            College psg = collegeRepo.save(College.builder()
                    .slug("psg-tech")
                    .name("PSG College of Technology")
                    .shortName("PSG Tech")
                    .tagline("Empowering Innovation Since 1951")
                    .type("Autonomous Engineering College")
                    .collegeType("Autonomous")
                    .district("Coimbatore")
                    .city("Coimbatore")
                    .address("Peelamedu, Coimbatore, Tamil Nadu")
                    .phone("0422-2572177")
                    .email("info@psgtech.ac.in")
                    .website("https://www.psgtech.edu")
                    .affiliation("Anna University")
                    .university("Anna University")
                    .accreditation("NAAC A++ • NBA • NIRF 67")
                    .established(1951)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build());
            College cit = collegeRepo.save(College.builder()
                    .slug("cit-coimbatore")
                    .name("Coimbatore Institute of Technology")
                    .shortName("CIT")
                    .tagline("Knowledge is Power")
                    .type("Government Aided Autonomous")
                    .collegeType("Government")
                    .district("Coimbatore")
                    .city("Coimbatore")
                    .address("Avinashi Road, Coimbatore, Tamil Nadu")
                    .affiliation("Anna University")
                    .university("Anna University")
                    .accreditation("NAAC A+ • NBA • NIRF 102")
                    .established(1956)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build());
            College kct = collegeRepo.save(College.builder()
                    .slug("kumaraguru-college")
                    .name("Kumaraguru College of Technology")
                    .shortName("KCT")
                    .tagline("Character is Life")
                    .type("Autonomous Private")
                    .collegeType("Private")
                    .district("Coimbatore")
                    .city("Coimbatore")
                    .address("Saravanampatti, Coimbatore, Tamil Nadu")
                    .affiliation("Anna University")
                    .university("Anna University")
                    .accreditation("NAAC A++ • NBA • NIRF 89")
                    .established(1984)
                    .verified(true)
                    .verificationStatus(College.VerificationStatus.VERIFIED)
                    .build());

            courseRepo.save(Course.builder().college(psg).name("B.E. Computer Science and Engineering").degreeType("B.E").level("UG").duration("4 Years").fees("₹2,20,000/year").intake(180).active(true).build());
            courseRepo.save(Course.builder().college(psg).name("B.Tech Artificial Intelligence & Data Science").degreeType("B.Tech").level("UG").duration("4 Years").fees("₹2,50,000/year").intake(120).active(true).build());
            courseRepo.save(Course.builder().college(psg).name("BCA").degreeType("BCA").level("UG").duration("3 Years").fees("₹65,000/year").intake(120).active(true).build());

            User superAdmin = userRepo.save(User.builder().email("superadmin@tncolleges.com").username("superadmin")
                    .password(encoder.encode("superadmin123")).fullName("Super Admin").role(User.Role.SUPER_ADMIN).enabled(true).build());
            userRepo.save(User.builder().email("admin@tncolleges.in").username("platform_admin")
                    .password(encoder.encode("admin1234")).fullName("Platform Admin").role(User.Role.PLATFORM_ADMIN).enabled(true).build());
            userRepo.save(User.builder().email("admin@psgtech.ac.in").username("psg_admin")
                    .password(encoder.encode("psg123")).fullName("PSG Tech Admin").role(User.Role.COLLEGE_ADMIN).collegeId(psg.getId()).enabled(true).build());
            userRepo.save(User.builder().email("admin@cit.edu.in").username("cit_admin")
                    .password(encoder.encode("cit123")).fullName("CIT Admin").role(User.Role.COLLEGE_ADMIN).collegeId(cit.getId()).enabled(true).build());
            userRepo.save(User.builder().email("admin@kct.ac.in").username("kct_admin")
                    .password(encoder.encode("kct123")).fullName("KCT Admin").role(User.Role.COLLEGE_ADMIN).collegeId(kct.getId()).enabled(true).build());

            User demoUser = userRepo.save(User.builder().email("demo.student@tncolleges.in").username("demo_student")
                    .password(encoder.encode("demo1234")).fullName("Demo Student").role(User.Role.STUDENT).enabled(true).build());
            Student demoStudent = studentRepo.save(Student.builder().user(demoUser).fullName("Demo Student")
                    .email(demoUser.getEmail()).mobile("9876543210").district("Coimbatore").city("Coimbatore")
                    .profileCompletion(100).build());
            educationRepo.save(StudentEducation.builder().student(demoStudent)
                    .level(StudentEducation.EducationLevel.TWELFTH).schoolCollege("Demo Higher Secondary School")
                    .percentage("85").groupStream("Computer Science").build());
            preferencesRepo.save(StudentPreferences.builder().student(demoStudent)
                    .interestedCourse("B.E Computer Science").preferredDistrict("Coimbatore")
                    .collegeType(StudentPreferences.CollegeType.ANY).hostelRequired(true).build());

            User testStudent = userRepo.save(User.builder().email("student@test.com").username("test_student")
                    .password(encoder.encode("student123")).fullName("Test Student").role(User.Role.STUDENT).enabled(true).build());
            studentRepo.save(Student.builder().user(testStudent).fullName("Test Student").email(testStudent.getEmail())
                    .mobile("9876543211").district("Coimbatore").city("Coimbatore").profileCompletion(80).build());

            System.out.println("=== Student Portal seed data initialized ===");
            System.out.println("Platform Admin: admin@tncolleges.in / admin1234");
            System.out.println("Super Admin: superadmin@tncolleges.com / superadmin123");
            System.out.println("PSG Admin: admin@psgtech.ac.in / psg123 (college_id " + psg.getId() + ")");
            System.out.println("CIT Admin: admin@cit.edu.in / cit123 (college_id " + cit.getId() + ")");
            System.out.println("KCT Admin: admin@kct.ac.in / kct123 (college_id " + kct.getId() + ")");
            System.out.println("Demo Student: demo.student@tncolleges.in / demo1234");
        };
    }
}
