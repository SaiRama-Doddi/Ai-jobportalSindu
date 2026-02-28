package com.example.ai_recruiter.controller;



import com.example.ai_recruiter.entity.Role;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    // 🔥 HR fetch interviewers list
    @GetMapping("/interviewers")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> getInterviewers() {

        List<User> interviewers = userRepository.findByRole(Role.INTERVIEWER);

        return ResponseEntity.ok(
                interviewers.stream()
                        .map(u -> Map.of(
                                "id", u.getId(),
                                "name", u.getName()
                        ))
                        .toList()
        );
    }
}
