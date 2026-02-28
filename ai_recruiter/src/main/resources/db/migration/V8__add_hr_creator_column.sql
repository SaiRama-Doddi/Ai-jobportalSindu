ALTER TABLE users ADD COLUMN created_by_hr_id BIGINT;

ALTER TABLE users
    ADD CONSTRAINT fk_hr_creator
        FOREIGN KEY (created_by_hr_id) REFERENCES users(id);

