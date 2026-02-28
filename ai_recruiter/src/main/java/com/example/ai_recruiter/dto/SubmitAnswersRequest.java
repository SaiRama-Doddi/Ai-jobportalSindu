package com.example.ai_recruiter.dto;

import lombok.Data;

import java.util.List;

@Data
public class SubmitAnswersRequest {
    private Long interviewId;
    private List<AnswerRequest> answers;
}
