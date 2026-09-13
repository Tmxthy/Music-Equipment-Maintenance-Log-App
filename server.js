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

// Notice the ':id' in the URL! This is called a URL Parameter.
app.delete('/api/equipment/:id', async (req, res) => {
  try {
    // 1. Grab the ID out of the URL string
    const targetId = req.params.id;

    // 2. Tell PostgreSQL to delete that specific row
    await pool.query('DELETE FROM equipment WHERE id = $1', [targetId]);

    // 3. Send a simple success message back to the frontend
    res.json({ message: "Item deleted successfully!" });

  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Failed to delete equipment" });
  }
});

// ==========================================
// UPDATE ROUTE (The 'U' in CRUD)
// ==========================================
app.put('/api/equipment/:id', async (req, res) => {
  try {
    // 1. Grab the ID from the URL (Which locker are we opening?)
    const targetId = req.params.id;

    // 2. Grab the new data from the JSON package (What is the new data?)
    const { 
      name, type, brand, model, serial_number, 
      purchase_date, purchase_price, condition, notes 
    } = req.body;

    // 3. The SQL UPDATE Command
    // We set each column to a new $ variable, and use $10 for the ID at the end
    const updateQuery = `
      UPDATE equipment 
      SET 
        name = $1, 
        type = $2, 
        brand = $3, 
        model = $4, 
        serial_number = $5, 
        purchase_date = $6, 
        purchase_price = $7, 
        condition = $8, 
        notes = $9
      WHERE id = $10
      RETURNING *;
    `;

    // 4. Send the command and the 10 variables to PostgreSQL
    const result = await pool.query(updateQuery, [
      name, type, brand, model, serial_number, 
      purchase_date, purchase_price, condition, notes, 
      targetId
    ]);

    // 5. Tell the frontend we succeeded
    res.json({ 
      message: "Equipment updated successfully!", 
      updatedItem: result.rows[0] 
    });

  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Failed to update equipment" });
  }
});

// The Power Switch
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

