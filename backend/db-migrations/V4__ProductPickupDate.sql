CREATE TABLE product_pickup_date (
    product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL
);

INSERT INTO product_pickup_date (product_id, available_from, available_to)
VALUES (1, '2024-07-01', '2024-07-10'),
       (2, '2024-07-05', '2024-07-15'),
       (3, '2024-07-10', '2024-07-20'),
       (4, '2024-07-15', '2024-07-25'),
       (5, '2024-07-20', '2024-07-30'),
       (6, '2024-07-25', '2024-08-04'),
       (7, '2024-07-30', '2024-08-09'),
       (8, '2024-08-04', '2024-08-14'),
       (9, '2024-08-09', '2024-08-19'),
       (10, '2024-08-14', '2024-08-24');