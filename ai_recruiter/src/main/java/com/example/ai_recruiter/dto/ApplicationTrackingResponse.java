package com.example.ai_recruiter.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class ApplicationTrackingResponse {

    private Long applicationId;
    private String jobTitle;
    private Instant appliedAt;

    private String applicationStatus;
    private String interviewStatus;

    private Float averageRating;
    private String verdict;
    private String message;
}