package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.Score;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ScoreRepository extends JpaRepository<Score, Long> {
    List<Score> findByAnswerInterviewId(Long interviewId);
}
