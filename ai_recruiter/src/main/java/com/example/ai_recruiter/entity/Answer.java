package com.example.ai_recruiter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "answers")
@Getter
@Setter
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Question question;

    @ManyToOne
    private InterviewSession interview;

    @ManyToOne
    private User candidate;

    @Column(columnDefinition = "TEXT")
    private String answerText;

    private Instant submittedAt;
}
