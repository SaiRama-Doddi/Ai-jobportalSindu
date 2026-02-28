package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.SubmitAnswersRequest;
import com.example.ai_recruiter.service.AnswerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/answers")
@RequiredArgsConstructor
public class AnswerController {

    private final AnswerService answerService;

    @PostMapping("/submit")
    public ResponseEntity<?> submitAnswers(
            @RequestBody SubmitAnswersRequest request
    ) {
        answerService.submitAnswers(
                request.getInterviewId(),
                request.getAnswers()   // ✅ FIX HERE
        );
        return ResponseEntity.ok().build();
    }
}
