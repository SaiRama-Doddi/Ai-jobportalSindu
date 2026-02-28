package com.example.ai_recruiter.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Job
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    // Candidate user
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User candidate;

    // Resume used
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_id", nullable = false)
    private Resume resume;

    private String status; // APPLIED, REVIEWING, SELECTED, REJECTED

    @Column(name = "applied_at")
    private Instant appliedAt;

    // NEW FIELD (this fixes your issue)
    @OneToOne(mappedBy = "application", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"application"})
    private SkillGap skillGap;



    @Column(name = "match_score")
    private Float matchScore;

}

