package com.example.ai_recruiter.dto;

import lombok.Data;

@Data
public class ScoreRequest {

    private Long answerId;
    private int rating;
    private String comment;
}
