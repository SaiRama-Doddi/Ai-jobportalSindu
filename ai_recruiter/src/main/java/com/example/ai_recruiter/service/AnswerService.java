package com.example.ai_recruiter.service;

import com.example.ai_recruiter.dto.AnswerRequest;
import com.example.ai_recruiter.entity.Answer;
import com.example.ai_recruiter.entity.InterviewSession;
import com.example.ai_recruiter.entity.User;
import com.example.ai_recruiter.repo.AnswerRepository;
import com.example.ai_recruiter.repo.InterviewSessionRepository;
import com.example.ai_recruiter.repo.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnswerService {

    private final AnswerRepository answerRepo;
    private final InterviewSessionRepository interviewRepo;
    private final QuestionRepository questionRepo;
    private final UserService userService;

    public void submitAnswers(Long interviewId, List<AnswerRequest> requests) {

        InterviewSession interview = interviewRepo.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        if (!"IN_PROGRESS".equals(interview.getStatus())) {
            throw new RuntimeException("Interview is locked");
        }

        User candidate = userService.getCurrentUser();

        for (AnswerRequest req : requests) {

            Answer answer = new Answer();
            answer.setInterview(interview);
            answer.setCandidate(candidate);
            answer.setQuestion(
                    questionRepo.findById(req.getQuestionId())
                            .orElseThrow(() -> new RuntimeException("Question not found"))
            );
            answer.setAnswerText(req.getAnswerText());
            answer.setSubmittedAt(Instant.now());

            answerRepo.save(answer);
        }
    }
}
