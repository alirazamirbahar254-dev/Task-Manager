-- =========================
-- Users Table
-- =========================
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_refresh TIMESTAMP,
    session_start TIMESTAMP,
    reset_token TEXT,
    reset_token_expiry TIMESTAMP
);

-- =========================
-- Tasks Table
-- =========================
CREATE TABLE tasks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    columnid TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    user_id BIGINT,
    
-- Connects each task to its user
    CONSTRAINT fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
);