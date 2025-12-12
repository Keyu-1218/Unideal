CREATE TABLE product_photos (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL
);

INSERT INTO product_photos (product_id, photo_url)
VALUES (1, 'sofa1.jpeg'),
       (1, 'sofa2.jpeg'),
       (1, 'sofa3.jpeg'),
       (2, 'chair1.jpeg'),
       (2, 'chair2.jpeg'),
       (3, 'table1.jpeg'),
       (3, 'table2.jpeg'),
       (4, 'lamp1.jpeg'),
       (4, 'lamp2.jpeg'),
       (5, 'bookshelf1.jpeg'),
       (5, 'bookshelf2.jpeg'),
       (5, 'bookshelf3.jpeg'),
       (6, 'rug1.jpeg'),
       (6, 'rug2.jpeg'),
       (6, 'rug3.jpeg'),
       (7, 'cushion1.jpeg'),
       (7, 'cushion2.jpeg'),
       (7, 'cushion3.jpeg'),
       (8, 'curtains1.jpeg'),
       (8, 'curtains2.jpeg'),
       (8, 'curtains3.jpeg'),
       (9, 'desk1.jpeg'),
       (9, 'desk2.jpeg'),
       (10, 'bed_frame1.jpeg'),
       (10, 'bed_frame2.jpeg'),
       (10, 'bed_frame3.jpeg');