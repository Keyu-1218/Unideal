CREATE TABLE product_pickup_date (
    product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    available_from DATE NOT NULL,
    available_to DATE NOT NULL
);

INSERT INTO product_pickup_date (product_id, available_from, available_to)
VALUES (1, '2025-12-01', '2027-12-01'),
       (2, '2025-12-02', '2027-12-02'),
       (3, '2025-12-03', '2027-12-03'),
       (4, '2025-12-04', '2027-12-04'),
       (5, '2025-12-05', '2027-12-05'),
       (6, '2025-12-06', '2027-12-06'),
       (7, '2025-12-07', '2027-12-07'),
       (8, '2025-12-08', '2027-12-08'),
       (9, '2025-12-09', '2027-12-09'),
       (10, '2025-12-10', '2027-12-10');