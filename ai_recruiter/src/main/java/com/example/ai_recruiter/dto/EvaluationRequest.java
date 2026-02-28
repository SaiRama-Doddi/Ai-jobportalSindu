package com.example.ai_recruiter.dto;

import lombok.Data;
import java.util.Map;

@Data
public class EvaluationRequest {
    private Map<Long, Integer> ratings; // answerId -> rating
    private String comment;
}
