CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    product INT REFERENCES products(id) ON DELETE CASCADE,
    buyer INT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (product, buyer)
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);