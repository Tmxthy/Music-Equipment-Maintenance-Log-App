require('dotenv').config();

const express = require('express');
const { Pool } = require('pg'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// The secret key the server uses to sign the VIP badges.
const JWT_SECRET = process.env.JWT_SECRET; 

// ==========================================
// THE BOUNCER (Authentication Middleware)
// ==========================================
function authenticateToken(req, res, next) {
  // 1. Look at the request header for the VIP badge
  // It usually looks like: "Bearer [long_string_of_gibberish]"
  const authHeader = req.headers['authorization'];
  
  // Cut off the word "Bearer " and just grab the gibberish token
  const token = authHeader && authHeader.split(' ')[1];

  // 2. If there is no badge at all, kick them out
  if (!token) {
    return res.status(401).json({ error: "Access denied. No VIP badge found." });
  }

  // 3. Inspect the badge using our secret stamp
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // The badge is fake, altered, or expired
      return res.status(403).json({ error: "Invalid or expired badge." });
    }

    // 4. The badge is valid! 
    // We attach the user's info to the request so the next route knows who they are.
    req.user = user;
    
    // 5. Open the door and let them pass!
    next(); 
  });
}

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
app.post('/api/equipment', authenticateToken, async (req, res) => {
  try {
    // 1. Grab the package from the frontend
    const incomingData = req.body;
    const userId = req.user.id;

    // 2. Execute the secure database command
    const newEquipment = await pool.query(
      `INSERT INTO equipment (name, type, brand, model, serial_number, purchase_price, purchase_date, condition, notes, user_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
        incomingData.name, 
        incomingData.type, 
        incomingData.brand, 
        incomingData.model, 
        incomingData.serial_number, 
        incomingData.purchase_price, 
        incomingData.purchase_date, 
        incomingData.condition, 
        incomingData.notes,
        userId
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

app.get('/api/equipment', authenticateToken,async (req, res) => { 
  try {
    const userId = req.user.id;
    
    const equipment = await pool.query('SELECT * FROM equipment WHERE user_id = $1 ORDER BY id ASC', [userId]);
    res.json(equipment.rows);

  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Failed to fetch equipment" });
  }
});

// Notice the ':id' in the URL! This is called a URL Parameter.
app.delete('/api/equipment/:id', authenticateToken,async (req, res) => {
  try {
    // 1. Grab the ID out of the URL string
    const targetId = req.params.id;
    const userId = req.user.id;

    // 2. Tell PostgreSQL to delete that specific row
    await pool.query('DELETE FROM equipment WHERE id = $1 AND user_id = $2', [targetId, userId]);

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
app.put('/api/equipment/:id', authenticateToken, async (req, res) => {
  try {
    // 1. Grab the ID from the URL (Which locker are we opening?)
    const targetId = req.params.id;
    const userId = req.user.id;
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
      WHERE id = $10 AND user_id = $11
      RETURNING *;
    `;

    // 4. Send the command and the 10 variables to PostgreSQL
    const result = await pool.query(updateQuery, [
      name, type, brand, model, serial_number, 
      purchase_date, purchase_price, condition, notes, 
      targetId, userId
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

// ==========================================
// REGISTER ROUTE (Create a New User)
// ==========================================
app.post('/api/register', async (req, res) => {
  try {
    // 1. Unpack the email and password from the frontend
    const { email, password } = req.body;

    // 2. Scramble the password (the '10' means scramble it 10 times)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 3. The SQL Command: Save the email and the GIBBERISH password
    const insertQuery = `
      INSERT INTO users (email, password_hash) 
      VALUES ($1, $2) 
      RETURNING id, email;
    `;

    // 4. Send the array to PostgreSQL safely
    const result = await pool.query(insertQuery, [email, hashedPassword]);

    // 5. Send a success receipt back
    res.status(201).json({ 
      message: "User registered successfully!",
      user: result.rows[0] 
    });

  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({ error: "Failed to register user (Email might already exist)" });
  }
});

// ==========================================
// LOGIN ROUTE (Authenticate a User)
// ==========================================
app.post('/api/login', async (req, res) => {
  try {
    // 1. Unpack the login credentials from the frontend
    const { email, password } = req.body;

    // 2. Search the database for this exact email
    const userQuery = `SELECT * FROM users WHERE email = $1;`;
    const result = await pool.query(userQuery, [email]);

    // 3. SECURITY CHECK: Did we find a user?
    if (result.rows.length === 0) {
      // If the array is empty, the email doesn't exist. Kick them out.
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    // Save the user data to a variable
    const user = result.rows[0];

    // 4. SECURITY CHECK: Do the passwords match?
    // bcrypt.compare(rawPassword, hashedPassword)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      // Passwords don't match. Kick them out.
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // 5. Success! (We will add the VIP badge / JWT right here in the next step)
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      JWT_SECRET, 
      { expiresIn: '1h' }
    );
    
    res.json({ 
      message: "Login successful!",
      token: token, 
      user: { id: user.id, email: user.email } 
    });

  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

// The Power Switch
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

