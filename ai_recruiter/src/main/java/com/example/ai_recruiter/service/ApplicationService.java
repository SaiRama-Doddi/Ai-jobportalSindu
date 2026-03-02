package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.ApplicationResponse;
import com.example.ai_recruiter.dto.ApplicationTrackingResponse;
import com.example.ai_recruiter.dto.MyApplicationResponse;
import com.example.ai_recruiter.entity.*;
import com.example.ai_recruiter.repo.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobService jobService;
    private final ResumeRepository resumeRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final InterviewResultRepository interviewResultRepository;
    private final SkillGapService skillGapService;


    private final InterviewSessionRepository interviewSessionRepository;

    public Application applyToJob(Long jobId, Long resumeId) {

        User candidate = userService.getCurrentUser();
        Job job = jobService.getJobId(jobId);

        Resume resume = resumeRepository.findById(resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not found"));

        Application app = Application.builder()
                .job(job)
                .candidate(candidate)
                .resume(resume)
                .status("APPLIED")
                .appliedAt(Instant.now())
                .build();

        Application saved = applicationRepository.saveAndFlush(app);

        // 🔥 RUN AI ANALYSIS AUTOMATICALLY
        try {
            skillGapService.analyze(saved.getId());
        } catch (Exception e) {
            System.out.println("Skill analysis failed: " + e.getMessage());
        }

        return saved;
    }

    public List<MyApplicationResponse> getMyApplications(String email)
    {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        System.out.println("EMAIL FROM JWT = " + email);
        System.out.println("USER ID = " + user.getId());

        return applicationRepository.findMyApplications(user.getId());
    }


    public List<ApplicationResponse> getCandidatesForHR(Long jobId) {

        List<Application> apps = applicationRepository.findApplicationsForHR(jobId);

        return apps.stream().map(a -> {

            SkillGap sg = a.getSkillGap(); // may be null

            InterviewSession session = interviewSessionRepository
                    .findByApplicationId(a.getId())
                    .orElse(null);

            InterviewResult result = (session != null)
                    ? interviewResultRepository.findByInterviewId(session.getId()).orElse(null)
                    : null;

            return new ApplicationResponse(
                    a.getId(),
                    a.getCandidate().getName(),
                    a.getCandidate().getEmail(),
                    sg != null ? sg.getMatchScore() : null,
                    sg != null ? sg.getMissingSkills() : null,
                    sg != null ? sg.getMatchingSkills() : null,
                    a.getResume().getId(),
                    session != null && session.getInterviewer() != null ? session.getInterviewer().getName() : null,
                    session != null ? session.getStatus() : "APPLIED",
                    result != null ? result.getAverageRating() : null,
                    result != null ? result.getVerdict() : null,
                    result != null ? result.getFinalComment() : null
            );

        }).toList();
    }




    public List<ApplicationTrackingResponse> getMyTracking(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Application> applications = applicationRepository.findByCandidate(user);

        return applications.stream().map(app -> {

            InterviewSession interview = interviewSessionRepository
                    .findByApplicationId(app.getId())
                    .orElse(null);

            InterviewResult result = null;

            if (interview != null) {
                result = interviewResultRepository
                        .findByInterviewId(interview.getId())
                        .orElse(null);
            }

            String message = null;
            String verdict = null;
            Float avg = null;

            if (result != null) {
                verdict = result.getVerdict();
                avg = result.getAverageRating();

                message = switch (verdict) {
                    case "PASS" -> "🎉 Congratulations! You are selected for the next round.";
                    case "HOLD" -> "⏳ Your application is currently on hold.";
                    case "FAIL" -> "❌ You are not selected at this time.";
                    default -> "Result under review.";
                };
            }

            return ApplicationTrackingResponse.builder()
                    .applicationId(app.getId())
                    .jobTitle(app.getJob().getTitle())
                    .appliedAt(app.getAppliedAt())
                    .applicationStatus(app.getStatus())
                    .interviewStatus(interview != null ? interview.getStatus() : "NOT_STARTED")
                    .averageRating(avg)
                    .verdict(verdict)
                    .message(message)
                    .build();

        }).toList();
    }
}
