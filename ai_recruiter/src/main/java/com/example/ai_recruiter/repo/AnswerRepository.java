package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AnswerRepository extends JpaRepository<Answer, Long> {
    List<Answer> findByInterviewId(Long interviewId);
}

