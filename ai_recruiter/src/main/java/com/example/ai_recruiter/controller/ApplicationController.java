package com.example.ai_recruiter.controller;


import com.example.ai_recruiter.dto.ApplicationCreatedResponse;
import com.example.ai_recruiter.dto.ApplicationResponse;
import com.example.ai_recruiter.dto.MyApplicationResponse;
import com.example.ai_recruiter.entity.Application;
import com.example.ai_recruiter.service.ApplicationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    public ResponseEntity<ApplicationCreatedResponse> apply(@RequestBody ApplyRequest request) {

        Application app = applicationService.applyToJob(request.getJobId(), request.getResumeId());

        ApplicationCreatedResponse resp = new ApplicationCreatedResponse(
                app.getId(),
                app.getStatus(),
                app.getAppliedAt(),
                app.getJob().getId(),
                app.getJob().getTitle(),
                app.getResume().getId(),
                app.getResume().getFileName()
        );

        return ResponseEntity.ok(resp);
    }


    @Data
    public static class ApplyRequest {
        private Long jobId;
        private Long resumeId;
    }

    @GetMapping("/my")
    public ResponseEntity<List<MyApplicationResponse>> myApplications(Authentication authentication) {

        String email = authentication.getName();   // logged-in user email

        return ResponseEntity.ok(
                applicationService.getMyApplications(email)
        );
    }


    @GetMapping("/jobs/{jobId}/candidates")
    public ResponseEntity<List<ApplicationResponse>> getCandidates(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getCandidatesForHR(jobId));
    }



}
