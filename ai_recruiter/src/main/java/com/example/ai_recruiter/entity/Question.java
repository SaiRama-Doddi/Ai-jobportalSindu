package com.example.ai_recruiter.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.Map;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)          // important for PostgreSQL enum
    @Column(nullable = false, columnDefinition = "question_difficulty")
    private Difficulty difficulty;

    @Column(name = "question_text_en", nullable = false)
    private String questionTextEn;

    @JdbcTypeCode(SqlTypes.JSON)
    private String questionTextTranslated; /*  {"hi":"...", "te":"..."}*/
}

