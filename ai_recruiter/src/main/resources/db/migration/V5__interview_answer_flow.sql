--v5
CREATE TABLE interview_sessions (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL UNIQUE,
    candidate_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'IN_PROGRESS',
    started_at TIMESTAMP DEFAULT NOW(),
    submitted_at TIMESTAMP,
    evaluated_at TIMESTAMP,

    CONSTRAINT fk_is_application
        FOREIGN KEY (application_id) REFERENCES applications(id),

    CONSTRAINT fk_is_candidate
        FOREIGN KEY (candidate_id) REFERENCES users(id)
);


CREATE TABLE answers (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    interview_id BIGINT NOT NULL,
    candidate_id BIGINT NOT NULL,
    answer_text TEXT NOT NULL,
    submitted_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_ans_question
        FOREIGN KEY (question_id) REFERENCES questions(id),

    CONSTRAINT fk_ans_interview
        FOREIGN KEY (interview_id) REFERENCES interview_sessions(id),

    CONSTRAINT fk_ans_candidate
        FOREIGN KEY (candidate_id) REFERENCES users(id),

    CONSTRAINT uq_answer UNIQUE (question_id, interview_id)
);



ALTER TABLE scores
DROP CONSTRAINT fk_score_question;

ALTER TABLE scores
RENAME COLUMN question_id TO answer_id;

ALTER TABLE scores
ADD CONSTRAINT fk_score_answer
FOREIGN KEY (answer_id) REFERENCES answers(id);



CREATE TABLE interview_results (
    id BIGSERIAL PRIMARY KEY,
    interview_id BIGINT NOT NULL UNIQUE,
    interviewer_id BIGINT NOT NULL,
    total_score FLOAT,
    average_rating FLOAT,
    verdict VARCHAR(50),
    final_comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_ir_interview
        FOREIGN KEY (interview_id) REFERENCES interview_sessions(id),

    CONSTRAINT fk_ir_interviewer
        FOREIGN KEY (interviewer_id) REFERENCES users(id)
);
