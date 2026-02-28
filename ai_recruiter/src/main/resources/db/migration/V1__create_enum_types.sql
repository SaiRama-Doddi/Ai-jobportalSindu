-- V1__create_enum_types.sql

CREATE TYPE user_role AS ENUM ('ADMIN', 'HR', 'INTERVIEWER', 'REVIEWER', 'CANDIDATE');

CREATE TYPE question_difficulty AS ENUM ('EASY', 'MEDIUM', 'HARD');
