package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.entity.InterviewResult;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InterviewResultRepository extends JpaRepository<InterviewResult, Long> {

    Optional<InterviewResult> findByInterviewId(Long interviewId);
}

