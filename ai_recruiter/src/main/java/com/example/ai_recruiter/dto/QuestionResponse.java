package com.example.ai_recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Map;

@Data
@AllArgsConstructor
public class QuestionResponse {

    private Long id;
    private String difficulty;
    private String questionTextEn;
    private String questionTextTranslated;
    private SkillGapResponse skillGap;
}
