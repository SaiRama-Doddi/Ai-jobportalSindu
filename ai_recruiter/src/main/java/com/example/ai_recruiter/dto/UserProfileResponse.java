package com.example.ai_recruiter.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String name;
    private String email;
    private String role;
}
