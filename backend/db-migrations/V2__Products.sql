CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    seller INT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    short_description TEXT,
    price DECIMAL(10, 2) NOT NULL
);

INSERT INTO products (seller, title, short_description, price)
VALUES (1, 'Artek 66 Chair', 'Classic Artek Chair 66 by Alvar Aalto, white laminate seat with birch frame, in good condition with minor wear on the backrest.', 100),
       (1, 'Borg Armchair', 'Reupholstered armchair in excellent condition.', 200),
       (1, 'Hammock', 'Indoor hammock chair from Veke, a few years old, always used inside. Strong thick rope, repaired in parts but still solid. Rope can be included.', 35),
       (1, 'Rocking Chair', 'Black rocking chair in good condition. One visible mark on the armrest, otherwise minimal wear. Pickup only in Oulu/Kempele area.', 50),
       (1, 'Clas Ohlson Lamp', 'Clas Ohlson Lamp with IKEA bulb', 10),
       (1, 'Coffee Table', 'Round coffee table, marble-pattern stone top (loose/not fixed to legs) with brass-colored legs. Excellent condition, stylish and refined.', 100),
       (1, 'Table Lamp', 'Tradition Flowerpot VP9 matte grey cordless table lamp by Verner Panton. Used 1.5 years, good condition with minor mark. Includes charging cable and adjustable three-stage dimmer.', 60),
       (1, 'Sheep Stool', 'Adorable sheep-shaped stool (“lammasjakkara”). Softly charming, ideal for kids or cozy corners. Used but in good, intact condition.', 20),
       (1, 'Occasional Table', 'For sale is a very clean Vitra Eames LTE Occasional table. Mainly used as a decoration, and sold as unnecessary.', 90),
       (1, 'Bedside Table', 'Handmade solid birch nightstandwith a natural finish and a practical drawer — beautifully crafted for the bedroom or living-room side, excellent condition.', 60);