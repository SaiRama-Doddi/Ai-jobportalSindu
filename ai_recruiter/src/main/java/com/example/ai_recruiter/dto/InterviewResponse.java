package com.example.ai_recruiter.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class InterviewResponse {

    private Long interviewId;
    private String candidateName;
    private String jobTitle;
    private String status;
    private Float matchScore;
}
