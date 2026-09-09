const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// The Translators
app.use(cors()); // ADD THIS (It must go before your routes!)
app.use(express.json());

// The Receiver (POST route)
app.post('/api/logs', (req, res) => {
  const incomingData = req.body;
  console.log("New data received:", incomingData);
  
  res.json({
    message: "Data received loud and clear!",
    dataYouSent: incomingData
  });
});

// The Power Switch
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

