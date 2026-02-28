package com.example.ai_recruiter.controller;


import com.example.ai_recruiter.dto.AuthResponse;
import com.example.ai_recruiter.dto.LoginRequest;
import com.example.ai_recruiter.dto.RegisterRequest;
import com.example.ai_recruiter.dto.UserProfileResponse;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.UserRepository;
import com.example.ai_recruiter.service.AuthService;
import com.example.ai_recruiter.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }


    @GetMapping("/hr/interviewers")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public List<User> getMyInterviewers() {
        User hr = userService.getCurrentUser();
        return userRepository.findByCreatedByHr(hr);
    }


    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> getMyProfile() {
        return ResponseEntity.ok(authService.getMyProfile());
    }
}

