-- Complete Database Migration for Fly.io PostgreSQL
-- Run this after creating the database

-- V1: Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (LOWER(email));

INSERT INTO users (email, password_hash) 
VALUES ('sample_user@gmail.com', '$2b$12$iyVOawOYTgecZnRemAx7t.AjFlR/EOegA99XTIbnS2SlOx9KfTVZS')
ON CONFLICT (email) DO NOTHING;

-- V2: Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    seller INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    short_description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (seller, title, short_description, price)
VALUES 
    (1, 'Artek 66 Chair', 'Classic Artek Chair 66 by Alvar Aalto, white laminate seat with birch frame, in good condition with minor wear on the backrest.', 100),
    (1, 'Borg Armchair', 'Reupholstered armchair in excellent condition.', 200),
    (1, 'Hammock', 'Indoor hammock chair from Veke, a few years old, always used inside. Strong thick rope, repaired in parts but still solid. Rope can be included.', 35),
    (1, 'Rocking Chair', 'Black rocking chair in good condition. One visible mark on the armrest, otherwise minimal wear. Pickup only in Oulu/Kempele area.', 50),
    (1, 'Clas Ohlson Lamp', 'Clas Ohlson Lamp with IKEA bulb', 10),
    (1, 'Coffee Table', 'Round coffee table, marble-pattern stone top (loose/not fixed to legs) with brass-colored legs. Excellent condition, stylish and refined.', 100),
    (1, 'Table Lamp', 'Tradition Flowerpot VP9 matte grey cordless table lamp by Verner Panton. Used 1.5 years, good condition with minor mark. Includes charging cable and adjustable three-stage dimmer.', 60),
    (1, 'Sheep Stool', 'Adorable sheep-shaped stool ("lammasjakkara"). Softly charming, ideal for kids or cozy corners. Used but in good, intact condition.', 20),
    (1, 'Occasional Table', 'For sale is a very clean Vitra Eames LTE Occasional table. Mainly used as a decoration, and sold as unnecessary.', 90),
    (1, 'Bedside Table', 'Handmade solid birch nightstandwith a natural finish and a practical drawer — beautifully crafted for the bedroom or living-room side, excellent condition.', 60)
ON CONFLICT DO NOTHING;

-- V3: Product Photos
CREATE TABLE IF NOT EXISTS product_photos (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL
);

INSERT INTO product_photos (product_id, photo_url)
VALUES 
    (1, 'Artek 66 Chair 1.avif'), (1, 'Artek 66 Chair 2.avif'), (1, 'Artek 66 Chair 3.avif'), (1, 'Artek 66 Chair 4.avif'),
    (2, 'Borg armchair 4.avif'), (2, 'Borg armchair 2.avif'), (2, 'Borg armchair 3.avif'), (2, 'Borg armchair 1.avif'),
    (3, 'Hammock 5.avif'), (3, 'Hammock 2.avif'), (3, 'Hammock 3.avif'), (3, 'Hammock 4.avif'), (3, 'Hammock 1.avif'),
    (4, 'Rocking Chair 4.avif'), (4, 'Rocking Chair 2.avif'), (4, 'Rocking Chair 3.avif'), (4, 'Rocking Chair 1.avif'),
    (5, 'Clas Ohlson lamp 5.avif'), (5, 'Clas Ohlson lamp 2.avif'), (5, 'Clas Ohlson lamp 3.avif'), (5, 'Clas Ohlson lamp 4.avif'), (5, 'Clas Ohlson lamp 1.avif'),
    (6, 'Coffee Table 5.avif'), (6, 'Coffee Table 2.avif'), (6, 'Coffee Table 3.avif'), (6, 'Coffee Table 4.avif'), (6, 'Coffee Table 1.avif'),
    (7, 'Table Lamp 2.avif'), (7, 'Table Lamp 3.avif'), (7, 'Table Lamp 4.avif'), (7, 'Table Lamp 5.avif'), (7, 'Table Lamp 1.avif'),
    (8, 'Sheep Stool 3.avif'), (8, 'Sheep Stool 4.avif'), (8, 'Sheep Stool 5.avif'), (8, 'Sheep Stool 1.avif'), (8, 'Sheep Stool 2.avif'),
    (9, 'Occasional table 2.avif'), (9, 'Occasional table 3.avif'), (9, 'Occasional table 4.avif'), (9, 'Occasional table 5.avif'), (9, 'Occasional table 1.avif'),
    (10, 'Handmade Bedside Table 4.avif'), (10, 'Handmade Bedside Table 3.avif'), (10, 'Handmade Bedside Table 5.avif')
ON CONFLICT DO NOTHING;

-- V4: Product Pickup Date
CREATE TABLE IF NOT EXISTS product_pickup_date (
    product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL
);

INSERT INTO product_pickup_date (product_id, available_from, available_to)
VALUES 
    (1, '2025-12-01', '2027-12-01'), (2, '2025-12-02', '2027-12-02'),
    (3, '2025-12-03', '2027-12-03'), (4, '2025-12-04', '2027-12-04'),
    (5, '2025-12-05', '2027-12-05'), (6, '2025-12-06', '2027-12-06'),
    (7, '2025-12-07', '2027-12-07'), (8, '2025-12-08', '2027-12-08'),
    (9, '2025-12-09', '2027-12-09'), (10, '2025-12-10', '2027-12-10')
ON CONFLICT DO NOTHING;

-- V5: Product Pickup Address
CREATE TABLE IF NOT EXISTS product_pickup_address (
    product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL
);

INSERT INTO product_pickup_address (product_id, country, city, street, postal_code)
VALUES 
    (1, 'Finland', 'Helsinki', '123 Main St', '10001'),
    (2, 'Finland', 'Espoo', '456 Elm St', '90001'),
    (3, 'Finland', 'Helsinki', '789 Oak St', '60601'),
    (4, 'Finland', 'Helsinki', '101 Pine St', '77001'),
    (5, 'Finland', 'Espoo', '202 Maple St', '85001'),
    (6, 'Finland', 'Espoo', '303 Birch St', '19101'),
    (7, 'Finland', 'Helsinki', '404 Cedar St', '78201'),
    (8, 'Finland', 'Helsinki', '505 Walnut St', '92101'),
    (9, 'Finland', 'Espoo', '606 Chestnut St', '75201'),
    (10, 'Finland', 'Espoo', '707 Spruce St', '95101')
ON CONFLICT DO NOTHING;

-- V6: Conversations and Messages
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    product INT REFERENCES products(id) ON DELETE CASCADE,
    buyer INT REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (product, buyer)
);

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation INT REFERENCES conversations(id) ON DELETE CASCADE,
    sender INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    content TEXT NOT NULL
);

SELECT '✅ Database migration completed successfully!' AS status;
