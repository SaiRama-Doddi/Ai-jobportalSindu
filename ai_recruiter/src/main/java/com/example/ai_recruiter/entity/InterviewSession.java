package com.example.ai_recruiter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.List;

@Entity
@Table(name = "interview_sessions")
@Getter
@Setter
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private Application application;

    @ManyToOne
    private User candidate;

    @ManyToOne
    private User interviewer;  // 🔥 ADDED

    private String status; // SCHEDULED, IN_PROGRESS, SUBMITTED, EVALUATED



    @OneToMany(mappedBy = "interview", cascade = CascadeType.ALL)
    private List<Answer> answers;

    private Instant startedAt;
    private Instant submittedAt;
    private Instant evaluatedAt;
    private Instant scheduledAt; // 🔥 ADDED
}
