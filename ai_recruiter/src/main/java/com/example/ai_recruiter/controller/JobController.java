package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.CreateJobRequest;
import com.example.ai_recruiter.dto.JobResponse;
import com.example.ai_recruiter.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;



    // HR creates a Job + JD
    @PostMapping
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> createJob(@RequestBody CreateJobRequest request) {
        return ResponseEntity.ok(jobService.createJob(request));
    }

    // HR views jobs they created
    @GetMapping("/my")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> myJobs() {
        return ResponseEntity.ok(jobService.getJobsByCurrentHr());
    }


    // Public - ANY logged-in user (Candidate, HR, Interviewer, etc.) can see jobs
    @GetMapping
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }


    @GetMapping("/recommended")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> recommededJobs(){
        return ResponseEntity.ok(jobService.getRecommendedJobsForCandidate());
    }


    @PutMapping("/{jobId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long jobId,
            @RequestBody CreateJobRequest request
    ) {
        return ResponseEntity.ok(jobService.updateJob(jobId, request));
    }


    @DeleteMapping("/{jobId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok().build();
    }
/*
    @GetMapping("/{jobId}/candidates")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> getCandidates(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.getCandidatesForJob(jobId));
    }
*/


}
