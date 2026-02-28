-- V2__create_core_tables.sql

-- USERS
CREATE TABLE users (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        user_role NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- JOBS
CREATE TABLE jobs (
    id              BIGSERIAL PRIMARY KEY,
    hr_id           BIGINT NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT NOT NULL,
    required_skills JSONB NOT NULL,
    min_experience  INT,
    created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_jobs_hr
        FOREIGN KEY (hr_id) REFERENCES users (id)
);

-- RESUMES
CREATE TABLE resumes (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT NOT NULL,
    file_name      VARCHAR(255) NOT NULL,
    encrypted_blob BYTEA NOT NULL,
    parsed_json    JSONB,
    uploaded_at    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_resumes_user
        FOREIGN KEY (user_id) REFERENCES users (id)
);

-- APPLICATIONS
CREATE TABLE applications (
    id          BIGSERIAL PRIMARY KEY,
    job_id      BIGINT NOT NULL,
    user_id     BIGINT NOT NULL,
    resume_id   BIGINT NOT NULL,
    status      VARCHAR(50) NOT NULL,
    applied_at  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_app_job
        FOREIGN KEY (job_id) REFERENCES jobs (id),
    CONSTRAINT fk_app_user
        FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_app_resume
        FOREIGN KEY (resume_id) REFERENCES resumes (id)
);

-- SKILL_GAPS
CREATE TABLE skill_gaps (
    id             BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL,
    match_score    FLOAT,
    missing_skills JSONB,
    CONSTRAINT fk_sg_application
        FOREIGN KEY (application_id) REFERENCES applications (id)
);

-- QUESTIONS
CREATE TABLE questions (
    id                      BIGSERIAL PRIMARY KEY,
    application_id          BIGINT NOT NULL,
    difficulty              question_difficulty NOT NULL,
    question_text_en        TEXT NOT NULL,
    question_text_translated JSONB,
    CONSTRAINT fk_q_application
        FOREIGN KEY (application_id) REFERENCES applications (id)
);

-- SCORES
CREATE TABLE scores (
    id             BIGSERIAL PRIMARY KEY,
    question_id    BIGINT NOT NULL,
    interviewer_id BIGINT NOT NULL,
    rating         INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment        TEXT,
    created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    CONSTRAINT fk_score_question
        FOREIGN KEY (question_id) REFERENCES questions (id),
    CONSTRAINT fk_score_interviewer
        FOREIGN KEY (interviewer_id) REFERENCES users (id)
);
