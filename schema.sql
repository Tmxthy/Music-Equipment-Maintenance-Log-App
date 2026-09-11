CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    brand VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) NOT NULL,
    purchase_date DATE NOT NULL,
    purchase_price DECIMAL(10, 2) NOT NULL,
    condition VARCHAR(255) NOT NULL,
    notes TEXT
);

/*
 ID - SERIAL (PK)

Equipment name - VARCHAR

Equipment type - VARCHAR

Brand - VARCHAR

Model - VARCHAR

Serial number - VARCHAR

Purchase date - DATE

Purchase price - DECIMAL

Condition - VARCHAR 
*/