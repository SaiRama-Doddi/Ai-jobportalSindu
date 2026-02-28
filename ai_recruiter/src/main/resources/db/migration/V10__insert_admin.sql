INSERT INTO users (name, email, password, role, created_at)
VALUES (
           'Super Admin',
           'admin@gmail.com',
           '$2a$10$8Kz5uGk0W3p0mY5Z8sL7Iu6xqvZ8rY6W0fJ5T9kLmN1pQ2rS3tU',
           'ADMIN',
           NOW()
       );