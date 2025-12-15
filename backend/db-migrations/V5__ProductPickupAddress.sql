CREATE TABLE product_pickup_address (
    product_id INT PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL
);

INSERT INTO product_pickup_address (product_id, country, city, street, postal_code)
VALUES (1, 'Finland', 'Helsinki', '123 Main St', '10001'),
       (2, 'Finland', 'Espoo', '456 Elm St', '90001'),
       (3, 'Finland', 'Helsinki', '789 Oak St', '60601'),
       (4, 'Finland', 'Helsinki', '101 Pine St', '77001'),
       (5, 'Finland', 'Espoo', '202 Maple St', '85001'),
       (6, 'Finland', 'Espoo', '303 Birch St', '19101'),
       (7, 'Finland', 'Helsinki', '404 Cedar St', '78201'),
       (8, 'Finland', 'Helsinki', '505 Walnut St', '92101'),
       (9, 'Finland', 'Espoo', '606 Chestnut St', '75201'),
       (10, 'Finland', 'Espoo', '707 Spruce St', '95101');