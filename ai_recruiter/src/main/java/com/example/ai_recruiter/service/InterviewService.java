package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.CandidateResultResponse;
import com.example.ai_recruiter.dto.InterviewResponse;
import com.example.ai_recruiter.dto.ScheduleInterviewRequest;
import com.example.ai_recruiter.entity.*;
import com.example.ai_recruiter.repo.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final InterviewSessionRepository interviewRepo;
    private final ApplicationRepository applicationRepo;
    private final ScoreRepository scoreRepo;
    private final InterviewResultRepository resultRepo;
    private final UserService userService;
    private final UserRepository userRepo;
    private final InterviewSessionRepository interviewSessionRepo;
    private final AnswerRepository answerRepo;
    private final InterviewResultRepository interviewResultRepository;


    /* ================= START INTERVIEW ================= */
    public InterviewSession startInterview(Long applicationId) {

        Application app = applicationRepo.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        interviewRepo.findByApplicationId(applicationId)
                .ifPresent(i -> {
                    throw new RuntimeException("Interview already started");
                });

        InterviewSession interview = new InterviewSession();
        interview.setApplication(app);
        interview.setCandidate(app.getCandidate());
        interview.setStatus("IN_PROGRESS");
        interview.setStartedAt(Instant.now());

        return interviewRepo.save(interview);
    }

    /* ================= SUBMIT INTERVIEW ================= */
    public void submitInterview(Long interviewId) {

        InterviewSession interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (!"IN_PROGRESS".equals(interview.getStatus())) {
            throw new RuntimeException("Interview already submitted");
        }

        interview.setStatus("SUBMITTED");
        interview.setSubmittedAt(Instant.now());
        interviewRepo.save(interview);
    }

    /* ================= FINALIZE INTERVIEW ================= */
    public InterviewResult finalizeInterview(Long interviewId) {

        InterviewSession interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        List<Score> scores = scoreRepo.findByAnswerInterviewId(interviewId);

        if (scores.isEmpty()) {
            throw new RuntimeException("No scores submitted");
        }

        double avg = scores.stream().mapToInt(Score::getRating).average().orElse(0);
        double total = scores.stream().mapToInt(Score::getRating).sum();

        InterviewResult result = new InterviewResult();
        result.setInterview(interview);
        result.setInterviewer(userService.getCurrentUser());
        result.setAverageRating((float) avg);
        result.setTotalScore((float) total);
        result.setVerdict(avg >= 4 ? "PASS" : avg >= 3 ? "HOLD" : "FAIL");
        result.setCreatedAt(Instant.now());

        interview.setStatus("EVALUATED");
        interview.setEvaluatedAt(Instant.now());

        interviewRepo.save(interview);
        return resultRepo.save(result);
    }


    public void scheduleInterview(ScheduleInterviewRequest req) {

        InterviewSession session = interviewSessionRepo
                .findByApplicationId(req.getApplicationId())
                .orElseThrow(() -> new RuntimeException("Interview session not found"));

        User interviewer = userRepo.findById(req.getInterviewerId())
                .orElseThrow();

        session.setInterviewer(interviewer);
        session.setScheduledAt(Instant.parse(req.getDateTime()));
        session.setStatus("SCHEDULED");

        interviewSessionRepo.save(session);
    }


    public List<InterviewSession> getInterviewsForJob(Long jobId) {

        return interviewSessionRepo.findByApplicationJobId(jobId);
    }

    public void updateStatus(Long interviewId, String status) {

        InterviewSession session = interviewSessionRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        session.setStatus(status.toUpperCase());

        if ("IN_PROGRESS".equals(status)) {
            session.setStartedAt(Instant.now());
        }

        interviewSessionRepo.save(session);
    }



    public List<InterviewResponse> getAssignedInterviews(String email)
 {
        User interviewer = userRepo.findByEmail(email).orElseThrow();
        return interviewRepo.findAssigned(interviewer.getId());
    }



    public Map<String, Object> getInterviewDetails(Long interviewId) {

        InterviewSession interview = interviewRepo.findById(interviewId).orElseThrow();

        List<Map<String, Object>> qa = interview.getAnswers()
                .stream()
                .map(a -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("answerId", a.getId());
                    m.put("question", a.getQuestion().getQuestionTextEn());
                    m.put("answer", a.getAnswerText());
                    return m;
                }).toList();

        Map<String, Object> result = new HashMap<>();
        result.put("candidate", interview.getCandidate().getName());
        result.put("job", interview.getApplication().getJob().getTitle());
        result.put("questionsAnswers", qa);
        result.put("matchScore",
                interview.getApplication().getMatchScore() // adjust if different
        );


        return result;
    }




    public void evaluateInterview(Long interviewId,
                                  Map<Long, Integer> ratings,
                                  String comment) {

        InterviewSession interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        User interviewer = userService.getCurrentUser();

        int total = 0;

        for (Map.Entry<Long, Integer> entry : ratings.entrySet()) {
            Answer answer = answerRepo.findById(entry.getKey())
                    .orElseThrow(() -> new RuntimeException("Answer not found"));

            Score score = new Score();
            score.setAnswer(answer);
            score.setRating(entry.getValue());
            score.setInterviewer(interviewer);
            scoreRepo.save(score);

            total += entry.getValue(); // ⭐ accumulate
        }

        float average = ratings.isEmpty() ? 0 : (float) total / ratings.size();

        InterviewResult result = new InterviewResult();
        result.setInterview(interview);
        result.setInterviewer(interviewer);
        result.setFinalComment(comment);
        result.setTotalScore((float) total);        // ⭐ NEW
        result.setAverageRating(average);           // ⭐ NEW
        result.setVerdict(
                average >= 4 ? "PASS" :
                        average >= 3 ? "HOLD" : "FAIL"
        );

        resultRepo.save(result);

        interview.setStatus("EVALUATED");
        interview.setEvaluatedAt(Instant.now());
        interviewRepo.save(interview);
    }


    public CandidateResultResponse getCandidateResult(Long interviewId, String email) {

        InterviewResult result = interviewResultRepository
                .findByInterviewId(interviewId)
                .orElseThrow(() -> new RuntimeException("Result not available yet"));

        String verdict = result.getVerdict();
        String message;

        switch (verdict.toUpperCase()) {

            case "PASS" -> message = "🎉 Congratulations! You are selected for the next round.";

            case "HOLD" -> message = "⏳ Your application is currently on hold. We will update you soon.";

            case "FAIL" -> message = "❌ Thank you for attending. You are not selected at this time.";

            default -> message = "Result is under review.";
        }

        return CandidateResultResponse.builder()
                .averageRating(result.getAverageRating())
                .verdict(verdict)
                .message(message)
                .build();
    }

}

