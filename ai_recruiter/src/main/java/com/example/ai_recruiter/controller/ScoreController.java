package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.ScoreRequest;
import com.example.ai_recruiter.service.ScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    @PostMapping
    public ResponseEntity<?> scoreAnswer(@RequestBody ScoreRequest request) {

        scoreService.scoreAnswer(
                request.getAnswerId(),
                request.getRating(),
                request.getComment()
        );

        return ResponseEntity.ok().build();
    }
}
