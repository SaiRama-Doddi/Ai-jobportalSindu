package com.example.ai_recruiter.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CandidateResultResponse {

    private Float averageRating;
    private String verdict;
    private String message;
}
