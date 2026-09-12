require('dotenv').config();

const express = require('express');
const { Pool } = require('pg'); 

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'music_equipment_log',
  password: process.env.DB_PASSWORD,
  port: 5432, 
});

const cors = require('cors');
const app = express();
const port = 3000;

// The Translators
app.use(cors()); // ADD THIS (It must go before your routes!)
app.use(express.json());

// The Receiver (POST route)
// Notice we added 'async' here!
app.post('/api/equipment', async (req, res) => {
  try {
    // 1. Grab the package from the frontend
    const incomingData = req.body;
    
    // 2. Execute the secure database command
    const newEquipment = await pool.query(
      `INSERT INTO equipment (name, type, brand, model, serial_number, purchase_price, purchase_date, condition, notes) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
       RETURNING *`,
      [
        incomingData.name, 
        incomingData.type, 
        incomingData.brand, 
        incomingData.model, 
        incomingData.serialNumber, 
        incomingData.purchasePrice, 
        incomingData.purchaseDate, 
        incomingData.condition, 
        incomingData.notes
      ]
    );

    // 3. Send the official database row back as the receipt
    res.json({
      message: "Equipment permanently saved to database!",
      data: newEquipment.rows[0]
    });

  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Failed to save equipment" });
  }
});

app.get('/api/equipment', async (req, res) => { 
  try {
    const equipment = await pool.query('SELECT * FROM equipment ORDER BY id ASC');
    res.json(equipment.rows);

  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// The Power Switch
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

