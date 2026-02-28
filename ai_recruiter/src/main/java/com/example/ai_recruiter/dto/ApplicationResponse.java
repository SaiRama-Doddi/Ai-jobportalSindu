package com.example.ai_recruiter.dto;

import lombok.Getter;
@Getter
public class ApplicationResponse {

    private Long applicationId;
    private String candidateName;
    private String candidateEmail;
    private Double matchScore;
    private String missingSkills;
    private String matchingSkills;
    private Long resumeId;
    private String assignedInterviewer;   // ONLY THIS
    private Double averageRating;
    private String verdict;
    private String finalComment;
    private String interviewStatus;

    public ApplicationResponse(
            Long applicationId,
            String candidateName,
            String candidateEmail,
            Number matchScore,
            String missingSkills,
            String matchingSkills,
            Long resumeId,
            String assignedInterviewer,
            String interviewStatus,     // 🔥 9th
            Number averageRating,
            String verdict,
            String finalComment
    ) {
        this.applicationId = applicationId;
        this.candidateName = candidateName;
        this.candidateEmail = candidateEmail;
        this.matchScore = matchScore != null ? matchScore.doubleValue() : null;
        this.missingSkills = missingSkills;
        this.matchingSkills = matchingSkills;
        this.resumeId = resumeId;
        this.assignedInterviewer = assignedInterviewer;
        this.interviewStatus = interviewStatus;   // 🔥 moved up
        this.averageRating = averageRating != null ? averageRating.doubleValue() : null;
        this.verdict = verdict;
        this.finalComment = finalComment;
    }

}
