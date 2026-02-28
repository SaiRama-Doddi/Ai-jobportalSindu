-- V3
ALTER TABLE resumes
    ADD COLUMN encrypted_file BYTEA,
    ADD COLUMN encrypted_aes_key BYTEA;

ALTER TABLE resumes
    DROP COLUMN IF EXISTS encrypted_blob;
