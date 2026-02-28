package com.example.ai_recruiter.repo;

import com.example.ai_recruiter.dto.ApplicationResponse;
import com.example.ai_recruiter.dto.MyApplicationResponse;
import com.example.ai_recruiter.entity.Application;
import com.example.ai_recruiter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByCandidate(User candidate);

    @Query("""
SELECT new com.example.ai_recruiter.dto.MyApplicationResponse(
    a.id,
    a.status,
    a.appliedAt,
    a.job.id,
    a.job.title,
    a.resume.id,
    a.resume.fileName
)
FROM Application a
WHERE a.candidate.id = :candidateId
""")
    List<MyApplicationResponse> findMyApplications(Long candidateId);


    List<Application> findByJobId(Long jobId);



    @Query("""
SELECT new com.example.ai_recruiter.dto.ApplicationResponse(
    a.id,
    a.candidate.name,
    a.candidate.email,

    (SELECT sg.matchScore FROM SkillGap sg WHERE sg.application = a),
    (SELECT sg.missingSkills FROM SkillGap sg WHERE sg.application = a),
    (SELECT sg.matchingSkills FROM SkillGap sg WHERE sg.application = a),

    a.resume.id,

    i.interviewer.name,
    COALESCE(i.status, 'APPLIED'),

    (SELECT ir.averageRating FROM InterviewResult ir WHERE ir.interview = i),
    (SELECT ir.verdict FROM InterviewResult ir WHERE ir.interview = i),
    (SELECT ir.finalComment FROM InterviewResult ir WHERE ir.interview = i)
)
FROM Application a
LEFT JOIN InterviewSession i ON i.application = a
WHERE a.job.id = :jobId
""")
    List<ApplicationResponse> findCandidatesWithInterviewer(Long jobId);




    @Query("""
SELECT a FROM Application a
LEFT JOIN FETCH a.candidate
LEFT JOIN FETCH a.resume
WHERE a.job.id = :jobId
""")
    List<Application> findApplicationsForHR(Long jobId);












}
