package com.example.ai_recruiter.dto;


import lombok.Data;

@Data
public class AnswerRequest {

    private Long questionId;
    private String answerText;
}
