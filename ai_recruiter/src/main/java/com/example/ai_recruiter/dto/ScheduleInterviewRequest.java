package com.example.ai_recruiter.dto;

import lombok.Data;

@Data
public class ScheduleInterviewRequest {
    private Long applicationId;
    private Long interviewerId;
    private String dateTime; // ISO string
}
