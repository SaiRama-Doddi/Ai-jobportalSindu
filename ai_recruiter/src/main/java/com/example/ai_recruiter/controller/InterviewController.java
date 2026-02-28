package com.example.ai_recruiter.controller;

import com.example.ai_recruiter.dto.EvaluationRequest;
import com.example.ai_recruiter.dto.ScheduleInterviewRequest;
import com.example.ai_recruiter.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    /* ================= START ================= */
    @PostMapping("/start/{applicationId}")
    public ResponseEntity<?> startInterview(@PathVariable Long applicationId) {
        return ResponseEntity.ok(interviewService.startInterview(applicationId));
    }

    /* ================= SUBMIT ================= */
    @PostMapping("/{interviewId}/submit")
    public ResponseEntity<?> submitInterview(@PathVariable Long interviewId) {
        interviewService.submitInterview(interviewId);
        return ResponseEntity.ok().build();
    }

    /* ================= FINALIZE ================= */
    @PostMapping("/{interviewId}/finalize")
    public ResponseEntity<?> finalizeInterview(@PathVariable Long interviewId) {
        return ResponseEntity.ok(interviewService.finalizeInterview(interviewId));
    }

    @PostMapping("/schedule")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> scheduleInterview(@RequestBody ScheduleInterviewRequest req) {
        interviewService.scheduleInterview(req);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> getInterviewsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(interviewService.getInterviewsForJob(jobId));
    }
    @PutMapping("/{interviewId}/status")
    @PreAuthorize("hasRole('HR') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long interviewId,
            @RequestParam String status
    ) {
        interviewService.updateStatus(interviewId, status);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/assigned")
    @PreAuthorize("hasRole('INTERVIEWER') or hasRole('ADMIN')")
    public ResponseEntity<?> assigned(Authentication auth) {
        return ResponseEntity.ok(
                interviewService.getAssignedInterviews(auth.getName())
        );
    }


    @GetMapping("/{interviewId}/details")
    @PreAuthorize("hasRole('INTERVIEWER') or hasRole('ADMIN')")
    public ResponseEntity<?> getInterviewDetails(@PathVariable Long interviewId) {
        return ResponseEntity.ok(interviewService.getInterviewDetails(interviewId));
    }


    @PostMapping("/{interviewId}/evaluate")
    @PreAuthorize("hasRole('INTERVIEWER') or hasRole('ADMIN')")
    public ResponseEntity<?> evaluate(@PathVariable Long interviewId,
                                      @RequestBody EvaluationRequest req) {

        interviewService.evaluateInterview(
                interviewId,
                req.getRatings(),
                req.getComment()
        );

        return ResponseEntity.ok().build();
    }

    @GetMapping("/{interviewId}/result")
    @PreAuthorize("hasRole('CANDIDATE') or hasRole('ADMIN')")
    public ResponseEntity<?> getResult(
            @PathVariable Long interviewId,
            Authentication auth
    ) {

        return ResponseEntity.ok(
                interviewService.getCandidateResult(
                        interviewId,
                        auth.getName()
                )
        );
    }

}
