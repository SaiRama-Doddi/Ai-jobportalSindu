package com.example.ai_recruiter.controller;


import com.example.ai_recruiter.entity.*;
import com.example.ai_recruiter.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final ResumeRepository resumeRepository;

    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/jobs")
    public ResponseEntity<?> getAllJobs() {
        return ResponseEntity.ok(jobRepository.findAll());
    }

    @GetMapping("/applications")
    public ResponseEntity<?> getAllApplications() {
        return ResponseEntity.ok(applicationRepository.findAll());
    }

    @GetMapping("/resumes")
    public ResponseEntity<?> getAllResumes() {
        return ResponseEntity.ok(resumeRepository.findAll());
    }
}