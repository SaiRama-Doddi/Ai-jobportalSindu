package com.example.ai_recruiter.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;


@Entity
@Table(name = "interview_results")
@Getter
@Setter
@Data
public class InterviewResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    private InterviewSession interview;

    @ManyToOne
    private User interviewer;

    private Float totalScore;
    private Float averageRating;
    private String verdict;
    private String finalComment;

    private Instant createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = Instant.now();
    }

}
