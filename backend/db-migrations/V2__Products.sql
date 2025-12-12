CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    short_description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (seller, title, short_description, price)
VALUES (1, 'Sofa', 'Really Cool Sofa', 59.99),
       (1, 'Chair', 'Comfortable chair', 29.99),
       (1, 'Table', 'Wooden dining table', 99.99),
       (1, 'Lamp', 'Stylish floor lamp', 19.99),
       (1, 'Bookshelf', 'Spacious bookshelf', 49.99),
       (1, 'Rug', 'Cozy area rug', 39.99),
       (1, 'Cushion', 'Soft decorative cushion', 14.99),
       (1, 'Curtains', 'Elegant window curtains', 24.99),
       (1, 'Desk', 'Modern office desk', 89.99),
       (1, 'Bed Frame', 'Sturdy bed frame', 129.99);