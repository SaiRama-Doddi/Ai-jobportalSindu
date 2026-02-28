package com.example.ai_recruiter.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
@Builder
public class JobResponse {
    private Long id;
    private String title;
    private String description;
    private List<String> requiredSkills;
    private Integer minExperience;
    private Instant createdAt;
}
