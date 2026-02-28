--V6

ALTER TABLE interview_sessions
    ADD COLUMN scheduled_at TIMESTAMP,
ADD COLUMN interviewer_id BIGINT;

ALTER TABLE interview_sessions
    ADD CONSTRAINT fk_is_interviewer
        FOREIGN KEY (interviewer_id) REFERENCES users(id);


