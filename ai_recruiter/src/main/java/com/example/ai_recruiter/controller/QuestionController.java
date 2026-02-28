package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.QuestionResponse;
import com.example.ai_recruiter.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/questions")
@PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping("/generate/{applicationId}")
    public ResponseEntity<List<QuestionResponse>> generate(
            @PathVariable Long applicationId
    ) throws Exception {
        return ResponseEntity.ok(
                questionService.generate(applicationId)
        );
    }
}
