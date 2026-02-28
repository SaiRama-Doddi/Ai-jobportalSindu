package com.example.ai_recruiter.repo;


import com.example.ai_recruiter.entity.Resume;
import com.example.ai_recruiter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    // Find all resumes uploaded by a specific candidate
    List<Resume> findByCandidate(User candidate);

    // Check if a resume exists for a user
    boolean existsByCandidate(User candidate);

    void deleteByCandidate(User candidate);

    Optional<Resume> findTopByCandidateOrderByUploadedAtDesc(User candidate);

}
