package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.dto.InterviewResponse;
import com.example.ai_recruiter.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface    InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {

    // Existing
    Optional<InterviewSession> findByApplicationId(Long applicationId);

    // 🔥 ADD THIS FOR HR DASHBOARD
    List<InterviewSession> findByApplicationJobId(Long jobId);


    List<InterviewSession> findByInterviewerId(Long interviewerId);

    // ✅ FOR INTERVIEWER DASHBOARD
    @Query("""
SELECT new com.example.ai_recruiter.dto.InterviewResponse(
    i.id,
    i.application.candidate.name,
    i.application.job.title,
    i.status,
    i.application.matchScore
)
FROM InterviewSession i
WHERE i.interviewer.id = :interviewerId
""")
    List<InterviewResponse> findAssigned(Long interviewerId);



}
