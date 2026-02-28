package com.example.ai_recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ApplicationCreatedResponse {
    private Long id;
    private String status;
    private Instant appliedAt;
    private Long jobId;
    private String jobTitle;
    private Long resumeId;
    private String fileName;
}
