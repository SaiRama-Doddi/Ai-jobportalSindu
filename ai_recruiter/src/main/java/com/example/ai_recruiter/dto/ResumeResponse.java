package com.example.ai_recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Instant;

@Data
@AllArgsConstructor
public class ResumeResponse {
    private boolean exists;
    private Long resumeId;
    private String fileName;
    private Instant uploadedAt;
    private String viewUrl;
}
