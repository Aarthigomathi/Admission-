package com.tncolleges.platform.dto;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tncolleges.platform.model.College;
import com.tncolleges.platform.model.Course;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class ApiDtoTests {

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    @Test
    void collegeResponseDoesNotSerializeBidirectionalCourseRelationships() throws Exception {
        College college = College.builder()
                .id(1L)
                .slug("sample-college")
                .name("Sample College")
                .build();
        Course course = Course.builder()
                .id(2L)
                .name("B.E. Computer Science")
                .college(college)
                .build();
        college.setCourses(List.of(course));

        String json = objectMapper.writeValueAsString(CollegeResponse.from(college));

        assertTrue(json.contains("\"slug\":\"sample-college\""));
        assertFalse(json.contains("\"courses\""));
        assertFalse(json.contains("\"college\""));
    }

    @Test
    void courseResponseContainsRelationshipIdsInsteadOfNestedEntities() throws Exception {
        College college = College.builder().id(1L).slug("sample-college").name("Sample College").build();
        Course course = Course.builder().id(2L).name("B.E. Computer Science").college(college).build();

        String json = objectMapper.writeValueAsString(CourseResponse.from(course));

        assertTrue(json.contains("\"collegeId\":1"));
        assertFalse(json.contains("\"college\""));
    }
}
