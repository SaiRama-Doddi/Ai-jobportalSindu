package com.example.ai_recruiter.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateJobRequest {

    private String title;
    private String description;
    private List<String> requiredSkills; // ["java","spring boot","postgresql"]
    private Integer minExperience;
}
