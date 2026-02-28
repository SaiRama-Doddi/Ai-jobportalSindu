package com.example.ai_recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class SkillGapResponse {
    private Long id;
    private Double matchScore;
    private List<String> missingSkills;
    private List<String> availableSkills;
}
