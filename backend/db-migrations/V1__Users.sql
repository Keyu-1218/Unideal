CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

-- (Optional) enforce lower-case unique emails
CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
ON users (LOWER(email));

-- password: SAMPLE
INSERT INTO users (email, password_hash) VALUES ('sample_user@gmail.com', '$2b$12$iyVOawOYTgecZnRemAx7t.AjFlR/EOegA99XTIbnS2SlOx9KfTVZS');
