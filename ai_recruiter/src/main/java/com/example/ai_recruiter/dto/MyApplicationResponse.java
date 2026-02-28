package com.example.ai_recruiter.dto;

import lombok.*;
import java.time.Instant;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MyApplicationResponse {

    private Long applicationId;
    private String status;
    private Instant appliedAt;
    private Long jobId;
    private String jobTitle;
    private Long resumeId;
    private String resumeFileName;
}
