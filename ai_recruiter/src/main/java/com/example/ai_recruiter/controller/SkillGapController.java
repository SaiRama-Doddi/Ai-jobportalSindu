package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.SkillGapResponse;
import com.example.ai_recruiter.service.SkillGapService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    @PostMapping("/analyze/{applicationId}")
    public ResponseEntity<SkillGapResponse> analyze(
            @PathVariable Long applicationId
    ) throws Exception {
        return ResponseEntity.ok(skillGapService.analyze(applicationId));
    }
}
