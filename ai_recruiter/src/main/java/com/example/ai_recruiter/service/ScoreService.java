package com.example.ai_recruiter.service;

import com.example.ai_recruiter.entity.Answer;
import com.example.ai_recruiter.entity.InterviewSession;
import com.example.ai_recruiter.entity.Score;
import com.example.ai_recruiter.repo.AnswerRepository;
import com.example.ai_recruiter.repo.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepo;
    private final AnswerRepository answerRepo;
    private final UserService userService;

    public void scoreAnswer(Long answerId, int rating, String comment) {

        Answer answer = answerRepo.findById(answerId)
                .orElseThrow(() -> new RuntimeException("Answer not found"));

        InterviewSession interview = answer.getInterview();

        if (!"SUBMITTED".equals(interview.getStatus())) {
            throw new RuntimeException("Interview not ready for evaluation");
        }

        Score score = new Score();
        score.setAnswer(answer);
        score.setInterviewer(userService.getCurrentUser());
        score.setRating(rating);
        score.setComment(comment);

        scoreRepo.save(score);
    }
}

