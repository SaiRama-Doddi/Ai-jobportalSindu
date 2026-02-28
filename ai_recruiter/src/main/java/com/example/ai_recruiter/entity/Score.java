package com.example.ai_recruiter.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "scores")
@Getter
@Setter
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Answer answer;

    @ManyToOne
    private User interviewer;

    private int rating;
    private String comment;
}
